import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  forwardRef,
  HttpException,
  Inject,
} from '@nestjs/common';
import { OrderPayment } from '@prisma/client';
import { Payment } from '@project-lc/shared-types';
import { Response } from 'express';
import { PaymentOrderProcess, PaymentService } from './payment.service';

export class PaymentOrderProcessException extends HttpException {
  private _process: PaymentOrderProcess;
  private _tossPaymentResult?: Payment;
  private _orderPayment?: OrderPayment;

  // https://docs.tosspayments.com/guides/apis/usage#%EC%97%90%EB%9F%AC-%EA%B0%9D%EC%B2%B4
  constructor({
    error,
    code,
    process,
    tossPaymentResult,
    orderPayment,
  }: {
    /** 에러객체 */
    error: string | Record<string, any>;
    /** 에러코드 */
    code: number;
    process?: PaymentOrderProcess;
    tossPaymentResult?: Payment;
    orderPayment?: OrderPayment;
  }) {
    super(error, code);

    if (process) this._process = process;
    if (tossPaymentResult) this._tossPaymentResult = tossPaymentResult;
    if (orderPayment) this._orderPayment = orderPayment;
  }

  public get process(): PaymentOrderProcess {
    return this._process;
  }

  public set process(process: PaymentOrderProcess) {
    this._process = process;
  }

  public get tossPaymentResult(): Payment | undefined {
    return this._tossPaymentResult;
  }

  public set tossPaymentResult(tossPaymentResult: Payment) {
    this._tossPaymentResult = tossPaymentResult;
  }

  public get orderPayment(): OrderPayment | undefined {
    return this._orderPayment;
  }

  public set orderPayment(orderPayment: OrderPayment) {
    this._orderPayment = orderPayment;
  }
}

@Catch(PaymentOrderProcessException, HttpException)
export class PaymentOrderProcessExceptionFilter
  implements ExceptionFilter<PaymentOrderProcessException>
{
  constructor(
    // 동일 모듈내에 존재하는 서비스인데 Inject(forwardRef) 사용하지 않으면 resolve 안돼서 추가함
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
  ) {}

  async catch(
    exception: PaymentOrderProcessException,
    host: ArgumentsHost,
  ): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse();
    const { process, tossPaymentResult, orderPayment } = exception;

    const errorMessage = await this.paymentService.handlePayementError({
      process,
      tossPaymentResult,
      orderPayment,
      error,
    });
    await response.status(status).json({
      statusCode: status,
      message: errorMessage,
    });
  }
}
