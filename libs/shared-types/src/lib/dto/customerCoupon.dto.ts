import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { CouponStatus } from '@prisma/client';

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

export type CustomerCouponIdAndStatus = Pick<CustomerCouponDto, 'id' | 'status'>;
