import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { OrderPayment, PaymentMethod } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreatePaymentRes,
  KKsPaymentProviders,
  Payment,
  PaymentRequestDto,
  PaymentTransaction,
  TossPaymentCancelDto,
} from '@project-lc/shared-types';
import { PaymentsByDateRequestType, TossPaymentsApi } from '@project-lc/utils';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  /** 크크쇼 OrderPayment 테이블에 결제 데이터 저장 */
  public async savePaymentRecord(dto: {
    method: string;
    orderId?: number;
    paymentKey: string;
    depositDate?: Date;
    depositor?: string;
    depositSecret?: string;
    depositDueDate?: Date;
    depositDoneFlag: boolean;
    account?: string;
  }): Promise<OrderPayment> {
    let paymentMethod: PaymentMethod = PaymentMethod.card;
    if (dto.method === '카드') {
      paymentMethod = PaymentMethod.card;
    } else if (dto.method === '계좌이체') {
      paymentMethod = PaymentMethod.transfer;
    } else if (dto.method === '가상계좌') {
      paymentMethod = PaymentMethod.virtualAccount;
    }
    return this.prisma.orderPayment.create({
      data: {
        ...dto,
        method: paymentMethod,
      },
    });
  }

  /** 토스페이먼츠 결제승인 요청 API */
  public async createPayment(dto: PaymentRequestDto): Promise<CreatePaymentRes> {
    try {
      const result = await TossPaymentsApi.createPayment(dto);

      // 크크쇼 OrderPayment 테이블에 데이터 저장
      const orderPayment = await this.savePaymentRecord({
        method: result.method as PaymentMethod,
        paymentKey: result.paymentKey,
        depositDate: result.approvedAt ? new Date(result.approvedAt) : null,
        depositDoneFlag: !!result.approvedAt,
        depositSecret: result.secret,
        depositor: result.virtualAccount?.customerName,
        account: result.virtualAccount
          ? `${result.virtualAccount.bank}_${result.virtualAccount.accountNumber}`
          : null,
        depositDueDate: result.virtualAccount?.dueDate
          ? new Date(result.virtualAccount?.dueDate)
          : null,
      });

      return { status: 'success', orderId: dto.orderId, orderPaymentId: orderPayment.id };
    } catch (err) {
      console.error(err);
      return {
        status: 'error',
        message: err.response.data.message,
        orderId: dto.orderId,
      };
    }
  }

  /** 주문번호별 결제내역 */
  public async getPaymentByOrderCode(orderId: string): Promise<Payment> {
    try {
      return TossPaymentsApi.getPaymentByOrderId(orderId);
    } catch (error) {
      console.error(error.response);
      throw new HttpException(
        error.response.message || 'error in getPaymentByOrderId',
        error.response.status || 500,
      );
    }
  }

  /** 날짜 기간 거래내역 */
  public async getPaymentsByDate(
    dto: PaymentsByDateRequestType,
  ): Promise<PaymentTransaction> {
    try {
      return TossPaymentsApi.getPaymentsByDate(dto);
    } catch (error) {
      console.error(error.response);
      throw new HttpException(
        error.response.message || 'error in getPaymentsByDate',
        error.response.status || 500,
      );
    }
  }

  /** 토스페이먼츠 결제취소 요청 래핑 & 에러핸들링 */
  public async requestCancel<
    P extends KKsPaymentProviders,
    DTO extends PaymentCancelDto<P>,
  >(provider: P, _dto: DTO): Promise<{ transactionKey: string } & Record<string, any>> {
    try {
      if (provider === KKsPaymentProviders.TossPayments) {
        const dto = _dto as TossPaymentCancelDto;
        const cancelResult = await TossPaymentsApi.requestCancelPayment({
          paymentKey: dto.paymentKey,
          cancelReason: dto.cancelReason,
          cancelAmount: dto.cancelAmount,
          // 토스페이먼츠 가상계좌로 지불하여 환불계좌정보 있는 경우
          refundReceiveAccount: dto.refundReceiveAccount
            ? {
                bank: dto.refundReceiveAccount.bank,
                accountNumber: dto.refundReceiveAccount.accountNumber,
                holderName: dto.refundReceiveAccount.holderName,
              }
            : undefined,
        });

        return cancelResult;
      }
      throw new InternalServerErrorException(
        'Failed to cancel. requestCancel - "provider" must be defined',
      );
    } catch (error) {
      console.error(error.response);
      throw new HttpException(
        error.response.message || 'error in requestCancelTossPayment',
        error.response.status || 500,
      );
    }
  }
}
/** Payment프로바이더별 DTO 맵 { TossPayments:{ ...TossDto }, NaverPay: { ...NaverDto} } */
type IPaymentCancelKeyMap = Record<
  KKsPaymentProviders.TossPayments,
  TossPaymentCancelDto
> &
  Record<KKsPaymentProviders.NaverPay, { dtoExampleField: unknown }>;
/** Payment프로바이더별 결제 취소 DTO */
type PaymentCancelDto<T extends KKsPaymentProviders> = IPaymentCancelKeyMap[T];
