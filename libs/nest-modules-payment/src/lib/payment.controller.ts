import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ValidationPipe,
  Param,
  Get,
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import {
  Payment,
  PaymentRequestDto,
  CreatePaymentRes,
  GetPaymentByOrderCodeDto,
} from '@project-lc/shared-types';
import { PaymentService } from './payment.service';

@Controller('payment')
@UseInterceptors(HttpCacheInterceptor)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

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
