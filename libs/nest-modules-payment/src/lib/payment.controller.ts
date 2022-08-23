import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ValidationPipe,
  Param,
  Get,
  UseFilters,
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { OrderService } from '@project-lc/nest-modules-order';
import {
  Payment,
  PaymentRequestDto,
  CreatePaymentRes,
  GetPaymentByOrderCodeDto,
  CreateOrderDto,
  CreateOrderShippingDto,
} from '@project-lc/shared-types';
import { PaymentOrderProcessExceptionFilter } from './payment-exception.filter';
import { PaymentService } from './payment.service';

@Controller('payment')
@UseInterceptors(HttpCacheInterceptor)
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) {}

  @Post('/success/temp')
  @UseFilters(PaymentOrderProcessExceptionFilter)
  async requestPaymentsTemp(
    @Body('payment', ValidationPipe) paymentDto: PaymentRequestDto,
    @Body('order', new ValidationPipe({ transform: true })) orderDto: CreateOrderDto,
    @Body('shipping', ValidationPipe) { shipping }: CreateOrderShippingDto,
  ): Promise<{ orderId: number }> {
    // TODO : 리턴타입에 orderId는 포함되어야함
    const { orderId } = await this.paymentService.createPaymentTemp({
      paymentDto,
      orderDto,
      shipping,
    });
    // const payment = await this.paymentService.createPayment(paymentDto);

    // const orderDtoWithPaymentId = { ...orderDto, paymentId: payment.orderPaymentId };

    // const order = await this.orderService.createOrder({
    //   orderDto: orderDtoWithPaymentId,
    //   shippingData: shipping,
    // });

    // if (order.supportOrderIncludeFlag) {
    //   this.orderService.triggerPurchaseMessage(orderDto);
    // }
    return { orderId };
  }

  @Post('/success')
  async requestPayments(
    @Body(ValidationPipe) dto: PaymentRequestDto,
  ): Promise<CreatePaymentRes> {
    const payment = await this.paymentService.createPayment(dto);
    return payment;
  }

  @Get('/:orderCode')
  async getPaymentByOrderCode(
    @Param(ValidationPipe) { orderCode }: GetPaymentByOrderCodeDto,
  ): Promise<Payment> {
    return this.paymentService.getPaymentByOrderCode(orderCode);
  }
}
