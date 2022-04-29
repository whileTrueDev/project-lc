import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Prisma, ProcessStatus } from '@prisma/client';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateOrderCancellationDto,
  CreateOrderCancellationRes,
  GetOrderCancellationListDto,
  OrderCancellationListRes,
} from '@project-lc/shared-types';
import { Cache } from 'cache-manager';
import { nanoid } from 'nanoid';

@Injectable()
export class OrderCancellationService extends ServiceBaseWithCache {
  #ORDER_CANCELLATION_CACHE_KEY = 'order-cancellation';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  /* 주문취소 생성(소비자가 주문취소 요청 생성) */
  async createOrderCancellation(
    dto: CreateOrderCancellationDto,
  ): Promise<CreateOrderCancellationRes> {
    const { items, orderId, ...rest } = dto;

    // 취소 대상 주문 찾기 => 이 과정은 주문취소 생성 전 주문정보 확인할 때 처리할거같기는 함. 확실히 모르겠어서 여기서도 확인함. 중복작업인 경우 삭제필요
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new BadRequestException(
        `해당 주문이 존재하지 않습니다. 주문고유번호 : ${orderId}`,
      );
    }
    // 주문취소 가능한 주문상태인지 확인 (식품의 경우 상품준비 상태일때부터 환불처리 필요)
    const isOrderCancelable = ['orderReceived', 'paymentConfirmed'].includes(order.step);
    if (!isOrderCancelable) {
      throw new BadRequestException(
        `주문취소는 주문접수, 입금확인 단계에서만 신청 가능합니다.`,
      );
    }
    // 취소요청한 주문이 주문접수상태이면(환불 필요없음) 주문취소, 주문취소상품 상태 바로 완료 처리
    const status: ProcessStatus =
      order.step === 'orderReceived' ? 'complete' : 'requested';

    // 주문취소코드 생성
    const cancelCode = nanoid();

    // 주문취소 데이터 생성
    const data = await this.prisma.orderCancellation.create({
      data: {
        ...rest,
        cancelCode,
        order: { connect: { id: orderId } },
        status,
        completeDate: status === 'complete' ? new Date() : undefined,
        items: {
          create: items.map((item) => ({
            orderItem: { connect: { id: item.orderItemId } },
            orderItemOption: { connect: { id: item.orderItemOptionId } },
            amount: item.amount,
            status,
          })),
        },
      },
    });

    // 주문취소요청이 처리완료(승인)되면 주문 상태를 주문무효상태로 업데이트 // TODO: 주문 캐시데이터도 삭제 (주문모듈 작업한 브랜치 합친 이후 진행)
    if (status === 'complete') {
      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          step: 'orderInvalidated',
        },
      });
    }

    await this._clearCaches(this.#ORDER_CANCELLATION_CACHE_KEY);
    return data;
  }

  /* 주문취소 내역 조회 */
  async getOrderCancellationList(
    dto: GetOrderCancellationListDto,
  ): Promise<OrderCancellationListRes> {
    const { skip, take, customerId, sellerId } = dto;
    let where: Prisma.OrderCancellationWhereInput;
    // customerId가 주어진 경우 - 해당 소비자가 요청한 주문취소내역 조회
    if (customerId) {
      where = {
        order: { customerId },
      };
    }
    // sellerId가 주어진경우 - 주문취소상품에 해당 판매자가 판매하는 상품이 포함된 주문취소내역 조회
    if (sellerId) {
      where = {
        items: { some: { orderItem: { goods: { sellerId } } } },
      };
    }

    const totalCount = await this.prisma.orderCancellation.count({ where });

    // 주문취소내역에 필요한 데이터 조회
    const data = await this.prisma.orderCancellation.findMany({
      where,
      take,
      skip,
      include: {
        order: { select: { orderCode: true } },
        refund: true,
        items: {
          include: {
            orderItem: {
              select: {
                goods: {
                  select: {
                    id: true,
                    goods_name: true,
                    image: true,
                    seller: { select: { sellerShop: true } },
                  },
                },
              },
            },
            orderItemOption: true,
          },
        },
      },
    });

    // 조회한 데이터를 필요한 형태로 처리
    const list = data.map((d) => {
      const { items, ...rest } = d;

      const _items = items.map((i) => ({
        id: i.id,
        amount: i.amount,
        status: i.status,
        goodsName: i.orderItem.goods.goods_name,
        image: i.orderItem.goods.image[0]?.image,
        shopName: i.orderItem.goods.seller.sellerShop?.shopName,
        optionName: i.orderItemOption.name,
        optionValue: i.orderItemOption.value,
        price: Number(i.orderItemOption.discountPrice),
      }));

      return { ...rest, items: _items };
    });

    return {
      list,
      totalCount,
    };
  }

  /* 주문취소 수정(판매자, 관리자가 주문취소처리상태 수정 및 거절사유 입력 등) */

  /* 주문취소 철회(소비자가 요청했던 주문취소 철회) */
}
