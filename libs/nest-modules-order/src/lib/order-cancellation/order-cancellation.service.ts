import { BadRequestException, Injectable } from '@nestjs/common';
import {
  OrderCancellation,
  OrderProcessStep,
  Prisma,
  ProcessStatus,
} from '@prisma/client';
import { CipherService } from '@project-lc/nest-modules-cipher';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateOrderCancellationDto,
  CreateOrderCancellationRes,
  FindOrderCancelParams,
  GetOrderCancellationListDto,
  OrderCancellationDetailRes,
  OrderCancellationListRes,
  OrderCancellationUpdateRes,
  UpdateOrderCancellationStatusDto,
} from '@project-lc/shared-types';
import { nanoid } from 'nanoid';

@Injectable()
export class OrderCancellationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cipherService: CipherService,
  ) {}

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

    // 주문취소, 주문취소상품 상태 : 완료
    const status: ProcessStatus = 'complete';

    // 주문취소코드 생성
    const cancelCode = nanoid();

    // 주문취소 데이터 생성
    const data = await this.prisma.orderCancellation.create({
      data: {
        ...rest,
        cancelCode,
        order: { connect: { id: orderId } },
        status,
        completeDate: new Date(),
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

    return data;
  }

  /** 주문취소요청이 처리완료(승인) 후 주문의 상태 변경
   * 주문접수 상태에서 승인시 => 주문무효
   * 결제확인 상태에서 승인시 => 결제취소
   */
  private async updateOrderStateAfterOrderCancelApproved(orderId: number): Promise<void> {
    const originOrder = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { step: true },
    });

    if (originOrder) {
      let targetState: OrderProcessStep;
      if (originOrder.step === 'orderReceived') {
        targetState = 'orderInvalidated';
      }

      if (originOrder.step === 'paymentConfirmed') {
        targetState = 'paymentCanceled';
      }

      await this.prisma.$transaction([
        // 주문 상태 변경
        this.prisma.order.update({ where: { id: orderId }, data: { step: targetState } }),
        // 주문상품옵션 상태 변경
        this.prisma.orderItemOption.updateMany({
          where: { orderItem: { orderId } },
          data: { step: targetState },
        }),
      ]);
    }
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
        order: {
          select: {
            orderCode: true,
            id: true,
            payment: { select: { depositDoneFlag: true } },
            paymentPrice: true,
          },
        },
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
      const { items, refund, ...rest } = d;

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

      const _refund = refund
        ? {
            ...refund,
            refundAccount: this.cipherService.getDecryptedText(refund.refundAccount), // 환불계좌정보 복호화
          }
        : undefined;

      return {
        ...rest,
        items: _items,
        refund: _refund,
      };
    });

    const nextCursor = dto.skip + dto.take;
    return {
      list,
      totalCount,
      nextCursor: nextCursor >= totalCount ? undefined : nextCursor,
    };
  }

  /* 주문취소 수정(판매자, 관리자가 주문취소처리상태 수정 및 거절사유 입력 등) */
  async updateOrderCancellationStatus(
    id: number,
    dto: UpdateOrderCancellationStatusDto,
  ): Promise<OrderCancellationUpdateRes> {
    const { refundId, ...rest } = dto;

    await this.findOneOrderCancellation({ id });

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
      await this.updateOrderStateAfterOrderCancelApproved(orderCancellation.orderId);
    }

    return orderCancellation;
  }

  /** 주문취소가 존재하는지 확인 */
  async findOneOrderCancellation(
    where: Prisma.OrderCancellationWhereUniqueInput,
  ): Promise<OrderCancellation> {
    const orderCancellation = await this.prisma.orderCancellation.findUnique({
      where,
    });
    if (!orderCancellation) {
      throw new BadRequestException(
        `존재하지 않는 주문취소요청입니다.  ${JSON.stringify(where)}`,
      );
    }
    return orderCancellation;
  }

  /** 주문취소 상세조회
   */
  async getOrderCancellationDetail({
    cancelCode,
  }: FindOrderCancelParams): Promise<OrderCancellationDetailRes> {
    await this.findOneOrderCancellation({ cancelCode });

    const orderCancel = await this.prisma.orderCancellation.findUnique({
      where: { cancelCode },
      include: {
        order: {
          select: {
            orderCode: true,
            id: true,
            payment: { select: { depositDoneFlag: true } },
            paymentPrice: true,
          },
        },
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

    const { items, refund, ...rest } = orderCancel;

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

    const _refund = refund
      ? {
          ...refund,
          refundAccount: this.cipherService.getDecryptedText(refund.refundAccount), // 환불계좌정보 복호화
        }
      : undefined;

    return {
      ...rest,
      items: _items,
      refund: _refund,
    };
  }
}
