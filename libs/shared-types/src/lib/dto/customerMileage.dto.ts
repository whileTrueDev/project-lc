import { MileageActionType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CustomerMileageDto {
  // @IsNumber()
  // customerId: number;

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
