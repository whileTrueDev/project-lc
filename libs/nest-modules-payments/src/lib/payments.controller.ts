import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  UseInterceptors,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { PaymentsService } from './payments.service';

type PaymentsRequestType = { orderId: string; amount: number; paymentKey: string };
// @UseGuards(JwtAuthGuard)
@Controller('payments')
@UseInterceptors(HttpCacheInterceptor)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('/success')
  async requestPayments(
    @Res() res,
    @Body(ValidationPipe) dto: PaymentsRequestType,
  ): Promise<boolean | void> {
    const payments = await this.paymentsService.requestPayment(dto);
    if (!payments) {
      return res.redirect('http://localhost:4000/payments/failure');
    }
    return payments;
  }
}
