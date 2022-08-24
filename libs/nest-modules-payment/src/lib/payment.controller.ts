import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { OrderService } from '@project-lc/nest-modules-order';
import {
  CreateOrderDto,
  CreateOrderShippingDto,
  GetPaymentByOrderCodeDto,
  Payment,
  PaymentRequestDto,
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

  @Post('/success')
  @UseFilters(PaymentOrderProcessExceptionFilter)
  async requestPaymentsTemp(
    @Body('payment', ValidationPipe) paymentDto: PaymentRequestDto,
    @Body('order', new ValidationPipe({ transform: true })) orderDto: CreateOrderDto,
    @Body('shipping', ValidationPipe) { shipping }: CreateOrderShippingDto,
  ): Promise<{ orderId: number }> {
    const { orderId } = await this.paymentService.createPaymentAndOrder({
      paymentDto,
      orderDto,
      shipping,
    });
    return { orderId };
  }

  @Get('/:orderCode')
  async getPaymentByOrderCode(
    @Param(ValidationPipe) { orderCode }: GetPaymentByOrderCodeDto,
  ): Promise<Payment> {
    return this.paymentService.getPaymentByOrderCode(orderCode);
  }
}
