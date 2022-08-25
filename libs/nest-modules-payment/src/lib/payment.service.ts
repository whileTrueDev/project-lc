import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  Order,
  OrderPayment,
  PaymentMethod,
  VirtualAccountDepositStatus,
} from '@prisma/client';
import { CipherService } from '@project-lc/nest-modules-cipher';
import { OrderService } from '@project-lc/nest-modules-order';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateOrderDto,
  CreateOrderShippingData,
  KKsPaymentProviders,
  Payment,
  PaymentCancelRequestResult,
  PaymentRequestDto,
  PaymentTransaction,
  TossPaymentCancelDto,
} from '@project-lc/shared-types';
import { PaymentsByDateRequestType, TossPaymentsApi } from '@project-lc/utils';
import { PaymentCancelDto } from './IPaymentCancelKeyMap';
import { PaymentOrderProcessException } from './payment-exception.filter';

export type PaymentOrderProcess =
  | 'createTossPayments'
  | 'saveOrderPayment'
  | 'createOrder';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly cipherService: CipherService,
    private readonly orderService: OrderService,
  ) {}

  /** 토스페이먼츠 결제승인 결과 Payment 를 받아와 크크쇼 OrderPaymen생성 (결제정보 저장) */
  public async savePaymentRecord(result: Payment): Promise<OrderPayment> {
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

    const dto = {
      method: result.method as PaymentMethod,
      paymentKey: result.paymentKey,
      depositDate: result.approvedAt ? new Date(result.approvedAt) : undefined,
      depositDoneFlag: !!result.approvedAt,
      depositSecret: result.secret,
      ...virtualAccountInfo,
    };

    let paymentMethod: PaymentMethod = PaymentMethod.card;
    let depositStatus: VirtualAccountDepositStatus = null;
    if (result.method === '카드') {
      paymentMethod = PaymentMethod.card;
    } else if (result.method === '계좌이체') {
      paymentMethod = PaymentMethod.transfer;
    } else if (result.method === '가상계좌') {
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

  /** 결제 & 주문생성 같이 처리
   * 1. 토스페이먼츠 결제승인요청
   * 2. 크크쇼 OrderPayment 생성
   * 3. 크크쇼 Order 생성
   *
   * 각 단계마다 에러발생시 PaymentOrderProcessException 던짐
   * => POST /payment/success에 사용된 PaymentOrderProcessExceptionFilter에 걸려서 처리(결제취소처리) 후 프론트로 에러메시지 전달하는 구조로 되어있음
   */
  public async createPaymentAndOrder({
    paymentDto,
    orderDto,
    shipping,
  }: {
    paymentDto: PaymentRequestDto;
    orderDto: CreateOrderDto;
    shipping: CreateOrderShippingData[];
  }): Promise<{ orderId: number }> {
    let tossPaymentResult: Payment;
    let orderPayment: OrderPayment;
    let order: Order;

    this.logger.debug(`START 결제-주문 프로세스, orderCode : ${paymentDto.orderId}`);
    // * 1. 토스페이먼츠 결제요청
    try {
      tossPaymentResult = await TossPaymentsApi.createPayment(paymentDto);
    } catch (err) {
      this.logger.debug(
        `토스페이먼츠 결제승인에서 오류 발생, orderCode : ${paymentDto.orderId}, 에러코드 ${err?.response?.status}, 에러 : ${err} `,
      );
      throw new PaymentOrderProcessException({
        process: 'createTossPayments',
        error: err,
        code: err?.response?.status || 500,
      });
    }

    // * 2. 크크쇼 OrderPayment 테이블에 데이터 저장
    try {
      orderPayment = await this.savePaymentRecord(tossPaymentResult);
    } catch (err) {
      this.logger.debug(
        `orderPayment 생성중 오류발생, orderCode : ${paymentDto.orderId}, 에러 : ${err}`,
      );
      throw new PaymentOrderProcessException({
        process: 'saveOrderPayment',
        error: err,
        code: err?.response?.status || 500,
        tossPaymentResult,
      });
    }

    // * 3. 크크쇼 주문생성
    try {
      const orderDtoWithPaymentId = { ...orderDto, paymentId: orderPayment.id };

      order = await this.orderService.createOrder({
        orderDto: orderDtoWithPaymentId,
        shippingData: shipping,
      });

      if (order.supportOrderIncludeFlag) {
        this.orderService.triggerPurchaseMessage(orderDto);
      }
    } catch (err) {
      this.logger.debug(
        `Order 생성중 오류발생, orderCode : ${paymentDto.orderId}, 에러 : ${err}`,
      );
      throw new PaymentOrderProcessException({
        process: 'createOrder',
        error: err,
        code: err?.response?.status || 500,
        tossPaymentResult,
        orderPayment,
      });
    }

    return { orderId: order.id };
  }

  /** PaymentExceptionFilter에서 사용. 결제 오류 단계에 따라 해야 할일(결제취소처리)을 처리하고, 단계에 맞는 에러메시지 리턴 */
  public async handlePayementError({
    process: errorOccuredProcess,
    tossPaymentResult,
    error,
  }: {
    process: PaymentOrderProcess;
    error: string | Record<string, any>;
    tossPaymentResult?: Payment;
    orderPayment?: OrderPayment;
  }): Promise<string> {
    let errorMessage = '';

    const tossPaymentCancelable =
      tossPaymentResult &&
      tossPaymentResult.paymentKey &&
      tossPaymentResult.status === 'DONE' &&
      tossPaymentResult.method !== '가상계좌'; // 가상계좌를 선택한 경우 주문생성까지 완료하지 않는 이상 소비자에게 입금할 가상계좌 표시되지 않음 => 소비자는 입금불가능하므로 tossPaymentResult.status ='DONE' 일 수 없다

    switch (errorOccuredProcess) {
      case 'createTossPayments':
        // 토스페이먼츠에서 결제오류발생. toss결제x, 결제데이터x, 주문데이터x. 토스페이먼츠 결제 자체가 실행되지 않았으므로 크크쇼에서는 처리할게 없음
        // error.response.data 에 {code, message} 형태로 토스페이먼츠 에러객체가 들어옴 https://docs.tosspayments.com/guides/apis/usage#%EC%9D%91%EB%8B%B5-http-%EC%BD%94%EB%93%9C-%EB%AA%A9%EB%A1%9D
        errorMessage = `[토스페이먼츠 오류] ${
          typeof error === 'string' ? error : error?.response?.data?.message
        }`;
        break;

      case 'saveOrderPayment':
        // OrderPayment 생성중 오류발생. toss결제 o, 결제데이터x, 주문데이터x.
        // (결제방식이 가상계좌가 아닌 경우) 토스 결제취소처리 진행
        errorMessage = '결제데이터 생성 오류로 인한 실패';
        break;

      case 'createOrder':
        // Order 생성중 오류발생. toss결제 o,  결제데이터 o, 주문데이터 x
        // (결제방식이 가상계좌가 아닌 경우) 토스 결제취소처리 진행 & OrderPayment 상태 변경
        errorMessage = '주문데이터 생성 오류로 인한 실패';
        break;

      default:
        this.logger.debug(`알 수 없는 단계에서 오류발생. process : ${process}`);
        errorMessage = typeof error === 'string' ? error : error?.response?.data?.message;
        break;
    }

    // 토스페이먼츠 결제취소가 필요한 경우
    const tossPaymentCancelRequiredProcessList: PaymentOrderProcess[] = [
      'saveOrderPayment',
      'createOrder',
    ];
    // 토스페이먼츠 결제취소 실행
    if (
      tossPaymentCancelRequiredProcessList.includes(errorOccuredProcess) &&
      tossPaymentCancelable
    ) {
      await this.requestCancel(KKsPaymentProviders.TossPayments, {
        paymentKey: tossPaymentResult.paymentKey,
        cancelReason: errorMessage,
      });
    }
    return errorMessage;
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
        this.logger.debug(
          `[requestCancel] 토스 결제취소를 요청함. paymentKey: ${dto.paymentKey}, cancelReason: ${dto.cancelReason}, cancelAmount: ${dto.cancelAmount}`,
        );
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

        this.logger.debug(`[requestCancel] 토스 결제취소 완료 처리됨`);

        return cancelResult;
      }
      throw new InternalServerErrorException(
        `Failed to cancel. requestCancel - "provider" must be defined`,
      );
    } catch (error) {
      console.error(error.response.data);
      let paymentKey = '';
      if (provider === KKsPaymentProviders.TossPayments) {
        paymentKey = (_dto as TossPaymentCancelDto).paymentKey;
        this.logger.debug(
          `[requestCancel]토스 결제취소요청 오류. statusCode:${error.response.status}, message: ${error.response.data.message}, paymentKey: ${paymentKey}`,
        );

        throw new HttpException(
          `${
            error.response.message ||
            error.response.data.message ||
            'error in requestCancelTossPayment'
          }, paymentKey : ${paymentKey}`,
          error.response.status || error.response.data.code || 500,
        );
      }
      throw new HttpException(
        error.response.message || error.response.data.message || 'error in requestCancel',
        error.response.status || error.response.data.code || 500,
      );
    }
  }
}
