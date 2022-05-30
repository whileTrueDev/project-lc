import { Controller, UseInterceptors, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { PaymentTransaction } from '@project-lc/shared-types';
import { PaymentService } from './payment.service';

@UseGuards(JwtAuthGuard)
@Controller('payment/info')
@UseInterceptors(HttpCacheInterceptor)
export class PaymentInfoController {
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
}
