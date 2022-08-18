import { OrderProcessStep } from '@prisma/client';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class DeliveryDto {
  @IsNotEmpty()
  @IsString({ message: 'exportCode required' })
  exportCode: string;

  @IsNotEmpty()
  @IsIn([
    OrderProcessStep.partialShipping,
    OrderProcessStep.shipping,
    OrderProcessStep.shippingDone,
    OrderProcessStep.partialShippingDone,
  ])
  status: OrderProcessStep;
}
