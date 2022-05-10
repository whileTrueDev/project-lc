import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsDate,
  IsBoolean,
} from 'class-validator';
import {
  CouponStatus,
  AmountUnit,
  DiscountApplyField,
  DiscountApplyType,
} from '@prisma/client';

export class CustomerCouponDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNumber()
  couponId: number;

  @IsNumber()
  customerId: number;

  @IsOptional()
  @IsEnum(CouponStatus)
  status?: CouponStatus;
}
