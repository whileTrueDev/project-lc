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
import { OrderService } from '../order.service';

@Injectable()
export class OrderCancellationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cipherService: CipherService,
    private readonly orderService: OrderService,
  ) {}

  /** 주문취소 생성(소비자가 주문취소 요청 생성) 
   * 혹은 완료되지 않은 요청 반환 (해당 주문에 대해 완료되지 않은 주문취소요청이 있으면 새로 생성하지 않고 완료되지 않은 주문취소요청을 반환 )
    => 220712 기준, 전체 주문상품옵션 취소만 가능하기 때문에 완료되지 않은 주문취소 요청이 있으면 반환하도록 만들어둠 
  */
  async findOrCreateOrderCancellation(
    dto: CreateOrderCancellationDto,
  ): Promise<CreateOrderCancellationRes> {
    const { items, orderId, ...rest } = dto;

    // 취소 대상 주문 찾기 => 이 과정은 주문취소 생성 전 주문정보 확인할 때 처리할거같기는 함. 확실히 모르겠어서 여기서도 확인함. 중복작업인 경우 삭제필요
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) {
      throw new BadRequestException(
        `해당 주문이 존재하지 않습니다. 주문고유번호 : ${orderId}`,
      );
    }
    // 주문취소 가능한 주문상태인지 확인 (식품의 경우 상품준비 상태일때부터 환불처리 필요)
    // items의 모든 orderItemOptionId 가 결제완료/주문접수 상태여야 함
    const cancelRequestedOrderItemOptionsIds = items.map((i) => i.orderItemOptionId);
    const options = await this.prisma.orderItemOption.findMany({
      where: { id: { in: cancelRequestedOrderItemOptionsIds } },
      select: { step: true },
    });
    const isOrderCancelable = options.every((opt) =>
      ['orderReceived', 'paymentConfirmed'].includes(opt.step),
    );
    if (!isOrderCancelable) {
      throw new BadRequestException(
        `주문취소는 요청한 상품이 주문접수, 입금확인 단계인 경우에만 가능합니다.`,
      );
    }

    // 주문에 대한 완료되지 않은 주문취소요청이 존재하는지 확인, 있으면 완료되지 않은 주문취소요청을 반환 => // TODO : 주문 일부상품만 취소 가능하게 기능 변경시 바꿔야함
    const prevOrderCancellation = await this.prisma.orderCancellation.findFirst({
      where: { orderId, status: 'requested' },
    });
    if (prevOrderCancellation) {
      return prevOrderCancellation;
    }

    // 완료되지 않은 주문취소요청이 없다면 새로 생성
    // 주문취소, 주문취소상품 상태는 승인이 필요하지 않으므로 '완료됨' 상태로 생성한다
    let status: ProcessStatus = 'complete';
    // 만약 주문상태가 '결제완료' 상태인경우 환불과정이 필요하므로 '요청됨' 상태로 생성 후, 환불과정이 완료될 때 거기서 주문취소의 상태를 변경한다
    if (options.every((x) => x.step === 'paymentConfirmed')) {
      status = 'requested';
    }

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
            quantity: item.quantity,
            status,
          })),
        },
      },
    });

    return data;
  }

  /** 주문취소요청이 처리완료(승인) 후, 주문취소요청 승인된 주문상품옵션 상태 변경 && 주문의 상태 변경
   *
   * 주문접수 상태에서 승인시 => 주문무효
   * 결제확인 상태에서 승인시 => 결제취소
   *
   */
  private async updateOrderStateAfterOrderCancelApproved({
    orderId,
    orderCancellationId,
  }: {
    /** 주문취소요청 된 원 주문의 고유번호 */
    orderId: number;
    /** 현재 승인처리된 주문취소요청 고유번호 */
    orderCancellationId: number;
  }): Promise<void> {
    // 주문에 포함된 모든 주문상품옵션 구하기
    const everyOrderItemOptions = await this.prisma.orderItemOption.findMany({
      where: { orderItem: { orderId } },
      select: { id: true, step: true, orderCancellationItems: true },
    });
    // 위에서 구한 주문상품옵션 중 취소요청이 승인된 주문상품옵션(연결된 orderCancellation 존재, 해당 주문취소요청 상태가 '완료') 구하기
    const canceledOrderItemOptions = everyOrderItemOptions.filter(
      (o) =>
        o.orderCancellationItems.length > 0 &&
        o.orderCancellationItems.every((oc) => oc.status === 'complete'),
    );

    // 원 주문 데이터 구하기(결제정보 확인용)
    const originOrder = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { payment: true },
    });

    // * 취소요청 승인된 주문상품옵션의 새로운 상태 -> 원주문의 결제완료 여부에 따라 달라짐
    let orderItemOptionNewStep: OrderProcessStep;
    if (originOrder.payment && originOrder.payment.depositDoneFlag) {
      // 주문에 대한 결제정보 존재 && 입금완료 되었다면, 결제완료 상태의 주문을 취소하는 것이므로 '결제취소' 상태로 변경
      orderItemOptionNewStep = 'paymentCanceled';
    } else {
      // 주문에 대한 결제정보가 없거나, 입금완료 되지 않았다면(가상계좌결제 입금하지 않은경우) '주문무효' 상태로 변경
      orderItemOptionNewStep = 'orderInvalidated';
    }

    /// 상태 업데이트할 주문상품옵션들 id 구하기
    const targetOrderItemOptionsIds = canceledOrderItemOptions
      .filter((o) =>
        o.orderCancellationItems.every(
          (c) => c.orderCancellationId === orderCancellationId, // 주문상품옵션 중 orderCancellationId가 현재 승인처리된 주문취소인 경우
        ),
      )
      .map((opt) => opt.id);

    // 먼저 취소된 주문상품옵션 상태 업데이트 작업
    await this.prisma.orderItemOption.updateMany({
      where: { orderItem: { orderId }, id: { in: targetOrderItemOptionsIds } },
      data: { step: orderItemOptionNewStep },
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
        quantity: i.quantity, // 주문취소상품 개수
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

    // 주문취소요청이 처리완료(승인)되면 주문취소요청된 주문상품옵션과 주문 상태 업데이트
    if (orderCancellation.status === 'complete') {
      await this.updateOrderStateAfterOrderCancelApproved({
        orderId: orderCancellation.orderId,
        orderCancellationId: orderCancellation.id,
      });
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
      quantity: i.quantity, // 주문취소상품 개수
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
