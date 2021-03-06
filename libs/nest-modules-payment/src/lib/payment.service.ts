import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  Order,
  OrderPayment,
  PaymentMethod,
  VirtualAccountDepositStatus,
} from '@prisma/client';
import { CipherService } from '@project-lc/nest-modules-cipher';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreatePaymentRes,
  KKsPaymentProviders,
  Payment,
  PaymentCancelRequestResult,
  PaymentRequestDto,
  PaymentTransaction,
  TossPaymentCancelDto,
} from '@project-lc/shared-types';
import { PaymentsByDateRequestType, TossPaymentsApi } from '@project-lc/utils';
import { PaymentCancelDto } from './IPaymentCancelKeyMap';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cipherService: CipherService,
  ) {}

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
    let depositStatus: VirtualAccountDepositStatus = null;
    if (dto.method === '카드') {
      paymentMethod = PaymentMethod.card;
    } else if (dto.method === '계좌이체') {
      paymentMethod = PaymentMethod.transfer;
    } else if (dto.method === '가상계좌') {
      paymentMethod = PaymentMethod.virtualAccount;
      depositStatus = VirtualAccountDepositStatus.WAITING;
    }
    return this.prisma.orderPayment.create({
      data: {
        ...dto,
        method: paymentMethod,
        depositStatus,
      },
    });
  }

  /** 토스페이먼츠 결제승인 요청 API */
  public async createPayment(dto: PaymentRequestDto): Promise<CreatePaymentRes> {
    let result: Payment;
    try {
      result = await TossPaymentsApi.createPayment(dto);
    } catch (err) {
      console.log('error - createPayment > TossPaymentsApi.createPayment');
      console.error(err.response);
      return {
        status: 'error',
        message: err.response.data.message,
        orderId: dto.orderId,
      };
    }

    try {
      // 가상계좌 결제의 경우 소비자가 입금전까지는 승인되지 않으므로 approvedAt이 null로 전달됨
      // 가상계좌 결제시 입금전까지 depositDate : null, depositDoneFlag: false임
      const virtualAccountInfo = !result.virtualAccount
        ? undefined
        : {
            depositor: result.virtualAccount.customerName,
            depositDueDate: result.virtualAccount.dueDate
              ? new Date(result.virtualAccount.dueDate)
              : null,
            account: `${result.virtualAccount.bank}_${this.cipherService.getEncryptedText(
              result.virtualAccount.accountNumber,
            )}`,
          };

      // * 크크쇼 OrderPayment 테이블에 데이터 저장
      const orderPayment = await this.savePaymentRecord({
        method: result.method as PaymentMethod,
        paymentKey: result.paymentKey,
        depositDate: result.approvedAt ? new Date(result.approvedAt) : undefined,
        depositDoneFlag: !!result.approvedAt,
        depositSecret: result.secret,
        ...virtualAccountInfo,
      });

      return { status: 'success', orderId: dto.orderId, orderPaymentId: orderPayment.id };
    } catch (err) {
      console.log('error - createPayment > savePaymentRecord');
      console.error(err.response);
      return {
        status: 'error',
        message: err.response.data.message,
        orderId: dto.orderId,
      };
    }
  }

  /** 주문번호별 결제내역 */
  public async getPaymentByOrderCode(orderCode: Order['orderCode']): Promise<Payment> {
    try {
      return TossPaymentsApi.getPaymentByOrderCode(orderCode);
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
  >(provider: P, _dto: DTO): Promise<PaymentCancelRequestResult> {
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
        error.response.message ||
          error.response.data.message ||
          'error in requestCancelTossPayment',
        error.response.status || error.response.data.code || 500,
      );
    }
  }
}
