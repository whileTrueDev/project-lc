import { CACHE_MANAGER, HttpException, Inject, Injectable } from '@nestjs/common';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { OrderCancellationService } from '@project-lc/nest-modules-order';
import { PrismaService } from '@project-lc/prisma-orm';
import { CreateRefundDto, CreateRefundRes } from '@project-lc/shared-types';
import {
  makeDummyTossPaymentData,
  requestTossPaymentCancel,
  TossPaymentCancelDto,
} from '@project-lc/utils';
import { Cache } from 'cache-manager';
import { nanoid } from 'nanoid';

@Injectable()
export class RefundService extends ServiceBaseWithCache {
  #REFUND_CACHE_KEY = 'refund';

  constructor(
    private readonly prisma: PrismaService,
    private readonly orderCancellationService: OrderCancellationService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  /** 결제취소 테스트위해 결제데이터 필요하여 만들었음. // TODO: 결제요청 통해 OrderPayment 데이터 생성가능하거나 하여 필요없어지면 삭제하기 */
  async makeFakeOrderWithFakePayment(): Promise<any> {
    const paymentResultData = await makeDummyTossPaymentData();

    // 결제완료상태(orderPayment데이터 존재) + 주문취소요청 존재하는 주문 생성
    const orderWithPayment = await this.prisma.order.create({
      data: {
        orderCode: paymentResultData.orderId,
        customer: { connect: { id: 1 } },
        step: 'paymentConfirmed',
        recipientName: '받는사람명',
        recipientPhone: '01012341234',
        recipientEmail: 'sjdkfl@sdf.com',
        recipientAddress: '받는사람ㅁ주소',
        recipientDetailAddress: '받는사람상세주소',
        recipientPostalCode: '23423',
        ordererName: '주문자명',
        ordererPhone: '0101231242',
        ordererEmail: 'sdlkfj@gasd.com',
        memo: '결제취소 api 테스트 위한 가짜 결제정보 담은 주문생성',
        orderPrice: paymentResultData.totalAmount,
        paymentPrice: paymentResultData.totalAmount,
        payment: {
          create: {
            method: 'card', // fakePayment가 카드결제라서 카드
            paymentKey: paymentResultData.paymentKey,
            depositDate: paymentResultData.approvedAt,
            depositDoneFlag: !!paymentResultData.approvedAt,
          },
        },
        orderCancellations: {
          create: {
            cancelCode: nanoid(),
            responsibility: 'customer',
            items: {
              create: [],
            },
          },
        },
      },
    });

    return orderWithPayment;
  }

  /** 토스페이먼츠 결제취소 api 호출 */
  async _requestTossPaymentCancel(dto: TossPaymentCancelDto): Promise<any> {
    try {
      const data = await requestTossPaymentCancel(dto);
      return data;
    } catch (error) {
      throw new HttpException(
        error.response.data.message || 'error _requestTossPaymentCancel',
        error.response.status || 500,
      );
    }
  }

  private createRefundCode(): string {
    return nanoid();
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
      const cancelResult = await this._requestTossPaymentCancel({
        paymentKey: rest.paymentKey,
        cancelReason: rest.reason,
        cancelAmount: rest.refundAmount,
        // 토스페이먼츠 가상계좌로 지불 && 환불계좌정보 있는 경우
        refundReceiveAccount:
          rest.refundAccount && rest.refundAccount && rest.refundAccountHolder
            ? {
                bank: rest.refundBank,
                accountNumber: rest.refundAccount,
                holderName: rest.refundAccountHolder,
              }
            : undefined,
      });
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
      // TODO : 반품요청 상태를 완료로 업데이트(재배송/환불 일감 합친 후 진행)
    }

    await this._clearCaches(this.#REFUND_CACHE_KEY);
    return data;
  }

  /** 환불내역 목록 조회 - 소비자, 판매자 */
  // async getRefundList(): RefundListRes {

  // }

  /** 특정 환불내역 상세 조회 */
}
