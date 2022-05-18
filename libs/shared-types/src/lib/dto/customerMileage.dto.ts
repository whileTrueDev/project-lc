import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MileageActionType } from 'prisma/prisma-client';

export class CustomerMileageDto {
  @IsNumber()
  customerId: number;

  @IsNumber()
  mileage: number;

  @IsEnum(MileageActionType)
  actionType: MileageActionType;

  @IsString()
  reason: string;

  @IsOptional()
  @IsNumber()
  orderId?: number;

  @IsOptional()
  @IsNumber()
  reviewId?: number;
}
