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
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { getCustomerWebHost } from '@project-lc/utils';
import { PaymentByOrderId, PaymentTransaction } from '@project-lc/shared-types';
import { PaymentService } from './payment.service';

type PaymentsRequestType = { orderId: string; amount: number; paymentKey: string };
// @UseGuards(JwtAuthGuard)
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
    @Res() res,
    @Body(ValidationPipe) dto: PaymentsRequestType,
  ): Promise<boolean | void> {
    const hostUrl = getCustomerWebHost();

    const payment = await this.paymentService.createPayment(dto);
    if (!payment) {
      return res.redirect(`${hostUrl}/payment/failure`);
    }
    return payment;
  }

  @Get('/:orderId')
  async getPaymentByOrderId(
    @Param('orderId') orderId: string,
  ): Promise<PaymentByOrderId> {
    return this.paymentService.getPaymentByOrderId(orderId);
  }
}