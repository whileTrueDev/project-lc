import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ValidationPipe,
  Res,
  Param,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { getCustomerWebHost } from '@project-lc/utils';
import { Payment, PaymentTransaction, PaymentRequestDto } from '@project-lc/shared-types';
import { Response } from 'express';
import { PaymentService } from './payment.service';

@UseGuards(JwtAuthGuard)
@Controller('payment')
@UseInterceptors(HttpCacheInterceptor)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Get('/transactions')
  async getPaymentsByDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('startingAfter') startingAfter: string,
    @Query('limit') limit?: number,
  ): Promise<PaymentTransaction> {
    return this.paymentService.getPaymentsByDate({
      startDate,
      endDate,
      startingAfter,
      limit,
    });
  }

  @Post('/success')
  async requestPayments(
    @Res({ passthrough: true }) res: Response,
    @Body(ValidationPipe) dto: PaymentRequestDto,
  ): Promise<Payment | void> {
    const hostUrl = getCustomerWebHost();
    const payment = await this.paymentService.createPayment(dto);
    if (payment.error) {
      return res.redirect(`${hostUrl}/payment/fail?message=${payment.error.message}`);
    }
    return payment;
  }

  @Get('/:orderId')
  async getPaymentByOrderId(@Param('orderId') orderId: string): Promise<Payment> {
    return this.paymentService.getPaymentByOrderId(orderId);
  }
}
