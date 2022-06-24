import { Order } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class PaymentRequestDto {
  @IsString()
  orderId: string;

  @IsNumber()
  amount: number;

  @IsString()
  paymentKey: string;
}

export class GetPaymentByOrderCodeDto {
  @IsString()
  orderCode: Order['orderCode'];
}
