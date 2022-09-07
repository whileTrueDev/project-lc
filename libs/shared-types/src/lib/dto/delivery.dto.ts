import { OrderProcessStep } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

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

export class DeliveryManyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliveryDto)
  deliveryDTOs: DeliveryDto[];
}
