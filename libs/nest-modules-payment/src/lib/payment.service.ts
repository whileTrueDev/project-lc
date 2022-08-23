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

  public async savePaymentRecordTemp(result: Payment): Promise<OrderPayment> {
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

  /** 여기에 결제 & 주문생성 같이 하기 */
  public async createPaymentTemp({
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

    this.logger.debug(
      `START createPaymentTemp, orderId(orderCode) : ${paymentDto.orderId}`,
    );
    // * 1. 토스페이먼츠 결제요청
    try {
      tossPaymentResult = await TossPaymentsApi.createPayment(paymentDto);
    } catch (err) {
      this.logger.debug(
        `createPaymentTemp에서 에러캐치 - 함수 : createPayment, 에러코드 ${err?.response?.status}, 에러 : ${err} `,
      );
      throw new PaymentOrderProcessException({
        process: 'createTossPayments',
        error: err,
        code: err?.response?.status || 500,
      });
    }

    // * 2. 크크쇼 OrderPayment 테이블에 데이터 저장
    try {
      orderPayment = await this.savePaymentRecordTemp(tossPaymentResult);
    } catch (err) {
      this.logger.debug(
        `createPaymentTemp에서 에러캐치 - 함수 : savePaymentRecordTemp, 에러코드 ${
          err?.response?.status || 500
        }, 에러 : ${err}`,
      );
      throw new PaymentOrderProcessException({
        process: 'saveOrderPayment',
        error: err,
        code: err?.response?.status || 500,
        tossPaymentResult,
      });
    }

    // * 크크쇼 주문생성
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
        `createPaymentTemp에서 에러캐치 - 함수 : createOrder, 원에러코드 ${err?.response?.status} 원 에러 : `,
        err,
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

  /** 결제 오류 단계에 따라 해야 할일을 처리하고, 단계에 맞는 에러메시지 리턴함 */
  async handlePayementError({
    process: errorOccuredProcess,
    tossPaymentResult,
    orderPayment,
    error,
  }: {
    process: PaymentOrderProcess;
    error: string | Record<string, any>;
    tossPaymentResult?: Payment;
    orderPayment?: OrderPayment;
  }): Promise<string> {
    this.logger.debug(`
    [PaymentOrderProcessExceptionFilter 에서 에러핸들러 실행]
    process : ${errorOccuredProcess},
    paymentKey : ${tossPaymentResult?.paymentKey},
    orderPaymentId : ${orderPayment?.id}
    `);

    let errorMessage = '';

    const tossPaymentCancelable =
      tossPaymentResult &&
      tossPaymentResult.paymentKey &&
      tossPaymentResult.status === 'DONE' &&
      tossPaymentResult.method !== '가상계좌'; // 가상계좌를 선택한 경우 주문생성까지 완료하지 않는 이상 소비자에게 입금할 가상계좌 표시되지 않음 => 소비자는 입금불가능하므로 tossPaymentResult.status ='DONE' 일 수 없다

    switch (errorOccuredProcess) {
      case 'createTossPayments':
        this.logger.debug(
          `토스페이먼츠에서 결제오류발생. toss결제x, 결제데이터x, 주문데이터x. 토스페이먼츠 결제 자체가 실행되지 않았으므로 크크쇼에서는 처리할게 없음`,
        );
        // error?.response?.data 에 {code, message} 형태로 토스페이먼츠 에러객체가 들어옴 https://docs.tosspayments.com/guides/apis/usage#%EC%9D%91%EB%8B%B5-http-%EC%BD%94%EB%93%9C-%EB%AA%A9%EB%A1%9D
        // TODO:  토스페이먼츠에서 온 오류메시지를 보여줄 필요가 있을지?? 내부에러로 처리하고 로그만 남기는 게 나을지 ?
        errorMessage = `[토스페이먼츠 오류] ${
          typeof error === 'string' ? error : error?.response?.data?.message
        }`;
        break;

      case 'saveOrderPayment':
        this.logger.debug(
          `OrderPayment 생성중 오류발생. toss결제 o, 결제데이터x, 주문데이터x. 
          (결제방식이 가상계좌가 아닌 경우) 토스 결제취소처리 진행`,
        );
        errorMessage = '결제데이터 생성 오류로 인한 실패';
        break;

      case 'createOrder':
        this.logger.debug(
          `Order 생성중 오류발생. toss결제 o,  결제데이터 o, 주문데이터 x 
          (결제방식이 가상계좌가 아닌 경우) 토스 결제취소처리 진행 & OrderPayment 상태 변경`,
        );
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
    this.logger.debug(
      `[PaymentOrderProcessExceptionFilter 에서 에러핸들러 실행종료], 리턴될 에러메시지 : ${errorMessage}`,
    );
    return errorMessage;
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
        this.logger.debug(
          `
        토스 결제취소를 요청함:   
        paymentKey: ${dto.paymentKey},
        cancelReason: ${dto.cancelReason},
        cancelAmount: ${dto.cancelAmount}
        `,
          '[requestCancel]',
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

        this.logger.debug(`토스 결제취소 완료 처리됨`, '[requestCancel]');

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
          `
        토스 결제취소요청 오류 statusCode:${error.response.status}, message: ${error.response.data.message}, paymentKey: ${paymentKey}
        `,
          '[requestCancel]',
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
