import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrderCancellationService } from '@project-lc/nest-modules-order';
import { KKsPaymentProviders, PaymentService } from '@project-lc/nest-modules-payment';
import { ReturnService } from '@project-lc/nest-modules-return';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateRefundDto,
  CreateRefundRes,
  GetRefundListDto,
  PaymentCard,
  PaymentTransfer,
  PaymentVirtualAccount,
  RefundDetailRes,
  RefundListRes,
  TossPaymentCancelDto,
} from '@project-lc/shared-types';
import { TossPaymentsApi } from '@project-lc/utils';
import { nanoid } from 'nanoid';

@Injectable()
export class RefundService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderCancellationService: OrderCancellationService,
    private readonly paymentService: PaymentService,
    private readonly returnService: ReturnService,
  ) {}

  private createRefundCode(): string {
    return nanoid();
  }

  /** createRefundDto 에서 토스페이먼츠 결제취소 요청 dto 생성 */
  private makeTosspaymentCancelDtoFromCreateRefundDto(
    createRefundDto: CreateRefundDto,
  ): TossPaymentCancelDto {
    const refundReceiveAccount = {
      bank: createRefundDto.refundBank,
      accountNumber: createRefundDto.refundAccount,
      holderName: createRefundDto.refundAccountHolder,
    };
    const hasRefundAccountInfo =
      createRefundDto.refundBank &&
      createRefundDto.refundAccount &&
      createRefundDto.refundAccountHolder;

    const tossPaymentCancelDto = {
      paymentKey: createRefundDto.paymentKey,
      cancelReason: createRefundDto.reason,
      cancelAmount: createRefundDto.refundAmount,
      refundReceiveAccount: hasRefundAccountInfo ? refundReceiveAccount : undefined,
    };
    return tossPaymentCancelDto;
  }

  /** 환불데이터 생성
   * 1. (토스 결제취소 사용시)주문에 연결된 결제키로 토스페이먼츠 결제취소 요청하여 transactionKey 받기
   *   -> 이걸 여기서 실행해야 하는지 잘 모르겠음.. 프론트에서 호출하고 transaction 키 받아서, 환불정보 생성하는 요청을 한번 더 호출하는 방식으로 진행할 수 있을거같기는 함
   * 2. 결과를 Refund, RefundItem으로 저장 dto, res
   * 3. 연결된 Return, OrderCancellation 상태 업데이트...?
   */
  async createRefund(dto: CreateRefundDto): Promise<CreateRefundRes> {
    const { orderId, orderCancellationId, returnId, items, ...rest } = dto;

    let transactionKey: string | undefined;
    // 1. 토스페이먼츠 결제취소 api 사용하는 경우 transaction키 받기
    if (rest.paymentKey) {
      const cancelResult = await this.paymentService.requestCancel(
        KKsPaymentProviders.TossPayments,
        this.makeTosspaymentCancelDtoFromCreateRefundDto(dto),
      );
      transactionKey = cancelResult.transactionKey;
    }

    const data = await this.prisma.refund.create({
      data: {
        ...rest,
        refundCode: this.createRefundCode(),
        order: { connect: { id: orderId } },
        items: { create: items },
        transactionKey,
      },
    });

    // 연결된 주문취소 있는경우
    if (orderCancellationId) {
      // 환불정보와 연결 + 주문취소 상태를 완료로 업데이트
      await this.orderCancellationService.updateOrderCancellationStatus(
        orderCancellationId,
        {
          status: 'complete',
          refundId: data.id,
        },
      );
    }

    // 연결된 반품요청 있는경우
    if (returnId) {
      // 환불정보와 연결
      await this.returnService.updateReturnStatus(returnId, {
        status: 'complete',
        refundId: data.id,
      });
    }

    return data;
  }

  /** 환불내역 목록 조회 - 소비자, 판매자 */
  async getRefundList({
    take,
    skip,
    customerId,
    sellerId,
  }: GetRefundListDto): Promise<RefundListRes> {
    let where: Prisma.RefundWhereInput;
    if (customerId) {
      // customerId가 주어진 경우 : 소비자의 주문에 연결된 환불내역만 조회
      where = {
        order: { customerId },
      };
    }
    if (sellerId) {
      // sellerId 주어진 경우 : 환불상품에 연결된 주문상품이 해당 판매자의 상품인경우만 조회
      where = {
        items: { some: { orderItem: { goods: { sellerId } } } },
      };
    }
    const data = await this.prisma.refund.findMany({
      where,
      take,
      skip,
      include: {
        order: {
          select: {
            orderCode: true,
            customerId: true,
            paymentPrice: true,
            payment: true,
          },
        },
        orderCancellation: true,
        return: true,
        items: true,
      },
    });

    const count = await this.prisma.refund.count({ where });
    const nextCursor = (skip || 0) + take;
    return {
      count,
      nextCursor: nextCursor >= count ? undefined : nextCursor,
      list: data,
    };
  }

  /** 특정 환불내역 상세 조회 (환불 상세페이지에 필요한 데이터가 어떤건지 잘 모르겠음
   * 주문번호, 주문일, 환불상품 이름과 이미지, 환불상품옵션가격), 결제취소인지 반품인지여부 결제취소코드 혹은 반품코드, 접수일자, 완료일, (환불수단 => 토스페이먼츠 결제조회 api로 결제수단 상세정보 확인가능), 금액 */
  async getRefundDetail({ refundId }: { refundId: number }): Promise<RefundDetailRes> {
    const refund = await this.prisma.refund.findFirst({
      where: { id: refundId },
    });
    if (!refund) {
      const identifier = refundId;
      throw new BadRequestException(
        `환불정보가 존재하지 않습니다 입력한 환불고유번호 : ${identifier}`,
      );
    }

    const data = await this.prisma.refund.findUnique({
      where: { id: refund.id },
      include: {
        order: {
          select: {
            orderCode: true,
            createDate: true,
            payment: { select: { method: true } },
          },
        },
        items: {
          select: {
            orderItem: {
              select: {
                goods: { select: { id: true, goods_name: true, image: true } },
                shippingCost: true,
                shippingCostIncluded: true,
              },
            },
            orderItemOption: {
              select: {
                name: true,
                value: true,
                quantity: true,
                normalPrice: true,
                discountPrice: true,
              },
            },
          },
        },
        orderCancellation: true,
        return: true,
      },
    });

    const { items, ...rest } = data;

    const refundItemList = items.map((item) => {
      const { orderItem, orderItemOption } = item;
      const { goods, ...orderItemRest } = orderItem;
      const { id, goods_name, image } = goods;

      return {
        goodsId: id,
        goodsName: goods_name,
        image: image[0].image,
        ...orderItemRest,
        ...orderItemOption,
      };
    });

    let card: PaymentCard | undefined; // 카드로 결제하면 제공되는 카드 관련 정보입니다.
    let virtualAccount: PaymentVirtualAccount | undefined; // 가상계좌로 결제하면 제공되는 가상계좌 관련 정보입니다.
    let transfer: PaymentTransfer | undefined; // 계좌이체로 결제했을 때 이체 정보가 담기는 객체입니다.
    // 토스페이먼츠로 결제 && 환불한 경우 -> 결제정보 조회
    if (data.transactionKey && data.paymentKey) {
      const paymentData = await TossPaymentsApi.getPaymentByOrderId(rest.order.orderCode);

      if (paymentData.card) {
        card = paymentData.card;
      }
      if (paymentData.virtualAccount) {
        virtualAccount = paymentData.virtualAccount;
      }
      if (paymentData.transfer) {
        transfer = paymentData.transfer;
      }
    }

    return {
      ...rest,
      items: refundItemList,
      card,
      virtualAccount,
      transfer,
    };
  }
}
