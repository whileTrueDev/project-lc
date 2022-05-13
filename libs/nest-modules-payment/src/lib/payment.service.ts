import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PaymentByOrderId,
  PaymentTransaction,
  TossPaymentCancelDto,
} from '@project-lc/shared-types';
import { PaymentsByDateRequestType, TossPaymentsApi } from '@project-lc/utils';

@Injectable()
export class PaymentService {
  private PAYMENTS_SECRET_KEY: string;
  constructor(private readonly configService: ConfigService) {
    this.PAYMENTS_SECRET_KEY = this.configService.get('PAYMENTS_SECRET_KEY');
  }

  /** 결제승인 요청 API */
  async createPayment(dto): Promise<boolean> {
    try {
      await TossPaymentsApi.createPayment(dto);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  /** 주문번호별 결제내역 */
  async getPaymentByOrderId(orderId: string): Promise<PaymentByOrderId> {
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
  async getPaymentsByDate(dto: PaymentsByDateRequestType): Promise<PaymentTransaction> {
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
  async requestCancelTossPayment(
    dto: TossPaymentCancelDto,
  ): Promise<{ transactionKey: string } & Record<string, any>> {
    try {
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
    } catch (error) {
      console.error(error.response);
      throw new HttpException(
        error.response.message || 'error in requestCancelTossPayment',
        error.response.status || 500,
      );
    }
  }
}
