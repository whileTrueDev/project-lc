import {
  BadRequestException,
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { OrderCancellation, Prisma, ProcessStatus } from '@prisma/client';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateOrderCancellationDto,
  CreateOrderCancellationRes,
  GetOrderCancellationListDto,
  OrderCancellationListRes,
  OrderCancellationRemoveRes,
  OrderCancellationUpdateRes,
  UpdateOrderCancellationStatusDto,
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

    // 주문취소요청이 처리완료(승인)되면 주문 상태를 주문무효상태로 업데이트
    if (status === 'complete') {
      await this.updateOrderStateToOrderInvalidated(orderId);
    }

    await this._clearCaches(this.#ORDER_CANCELLATION_CACHE_KEY);
    // 주문캐시도 삭제
    await this._clearCaches('order');
    return data;
  }

  /** 주문의 상태를 주문무효 로 변경(주문취소요청이 처리완료(승인)되었을 때 사용)
   */
  private async updateOrderStateToOrderInvalidated(orderId: number): Promise<void> {
    // 주문 상태 주문무효로 변경
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        step: 'orderInvalidated',
      },
    });

    // 주문상품옵션 상태 주문무효로 변경
    await this.prisma.orderItemOption.updateMany({
      where: { orderItem: { orderId } },
      data: {
        step: 'orderInvalidated',
      },
    });
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
      orderBy: { requestDate: 'desc' },
      include: {
        order: { select: { orderCode: true } },
        refund: true,
        items: {
          include: {
            orderItem: {
              select: {
                id: true,
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

    // 조회한 데이터를 필요한 형태로 처리 -> 프론트 작업시 필요한 형태로 수정필요
    const list = data.map((d) => {
      const { items, ...rest } = d;

      const _items = items.map((i) => ({
        id: i.id, // 주문취소상품 고유번호
        amount: i.amount, // 주문취소상품 개수
        status: i.status, // 주문취소상품 처리상태
        goodsName: i.orderItem.goods.goods_name, // 원래 주문한 상품명
        image: i.orderItem.goods.image?.[0]?.image, // 주문 상품 이미지
        shopName: i.orderItem.goods.seller.sellerShop?.shopName, // 주문상품 판매상점명
        optionName: i.orderItemOption.name, // 주문상품옵션명
        optionValue: i.orderItemOption.value, // 주문상품옵션 값
        price: Number(i.orderItemOption.discountPrice), // 주문상품옵션 가격
        orderItemId: i.orderItem.id, // 연결된 주문상품고유번호
        orderItemOptionId: i.orderItemOption.id, // 연결된 주문상품옵션 고유번호
      }));

      return { ...rest, items: _items };
    });

    return {
      list,
      totalCount,
    };
  }

  /* 주문취소 수정(판매자, 관리자가 주문취소처리상태 수정 및 거절사유 입력 등) */
  async updateOrderCancellationStatus(
    id: number,
    dto: UpdateOrderCancellationStatusDto,
  ): Promise<OrderCancellationUpdateRes> {
    const { refundId, ...rest } = dto;

    await this.findOneOrderCancellation(id);

    const orderCancellation = await this.prisma.orderCancellation.update({
      where: { id },
      data: {
        ...rest,
        completeDate: ['complete', 'canceled'].includes(dto.status) // 완료 혹은 취소(거절)시 완료일시 저장
          ? new Date()
          : undefined,
        items: {
          updateMany: {
            where: { orderCancellationId: id },
            data: { status: dto.status },
          },
        },
        refund: refundId ? { connect: { id: refundId } } : undefined,
      },
    });

    // 주문취소요청이 처리완료(승인)되면 주문 상태를 주문무효상태로 업데이트
    if (orderCancellation.status === 'complete') {
      await this.updateOrderStateToOrderInvalidated(orderCancellation.orderId);
    }

    await this._clearCaches(this.#ORDER_CANCELLATION_CACHE_KEY);
    return orderCancellation;
  }

  /** 주문취소가 존재하는지 확인 */
  async findOneOrderCancellation(id: number): Promise<OrderCancellation> {
    const orderCancellation = await this.prisma.orderCancellation.findUnique({
      where: { id },
    });
    if (!orderCancellation) {
      throw new BadRequestException(
        `존재하지 않는 주문취소요청입니다. 주문취소 고유번호 ${id}`,
      );
    }
    return orderCancellation;
  }

  /* 주문취소 삭제(소비자가 자신이 요청했던 주문취소 철회 - 처리진행되기 이전에만 가능) */
  async deleteOrderCancellation(id: number): Promise<OrderCancellationRemoveRes> {
    const orderCancellation = await this.findOneOrderCancellation(id);

    // 주문취소 처리상태 확인
    if (orderCancellation.status !== 'requested') {
      throw new ForbiddenException(`상태가 '요청됨'인 주문취소만 삭제할 수 있습니다`);
    }

    const data = await this.prisma.orderCancellation.delete({
      where: { id },
    });

    await this._clearCaches(this.#ORDER_CANCELLATION_CACHE_KEY);
    return !!data;
  }
}
