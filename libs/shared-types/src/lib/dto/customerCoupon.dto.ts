import { IsNumber, IsOptional, IsEnum, IsArray } from 'class-validator';
import { CouponStatus } from '@prisma/client';

export class CustomerCouponDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNumber()
  couponId: number;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsEnum(CouponStatus)
  status?: CouponStatus;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  customerIds?: number[];
}
export class CouponStatusDto {
  @IsNumber()
  id: number;

  @IsEnum(CouponStatus)
  status: CouponStatus;
}

export type CustomerCouponIdAndStatus = Pick<CustomerCouponDto, 'id' | 'status'>;

export type IssueManyCustomerList = {
  customerId: number;
  couponId: number;
  status: CouponStatus;
};
