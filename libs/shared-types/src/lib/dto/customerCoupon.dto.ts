import { IsNumber, IsOptional, IsEnum, IsArray } from 'class-validator';
import { CouponStatus } from '@prisma/client';

export class CouponStatusDto {
  @IsNumber()
  id: number;

  @IsEnum(CouponStatus)
  status: CouponStatus;
}

export class CustomerCouponDto {
  @IsOptional() @IsNumber() id?: number;
  @IsNumber() couponId: number;
  @IsOptional() @IsEnum(CouponStatus) status?: CouponStatus;
}
/** 개별 소비자 쿠폰 생성 DTO */
export class CreateCustomerCouponDto extends CustomerCouponDto {
  @IsNumber()
  customerId: number;
}
/** 여러 소비자 쿠폰 생성 DTO */
export class CreateCustomerCouponManyDto extends CustomerCouponDto {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  customerIds?: number[];
}

export type CustomerCouponIdAndStatus = Pick<CustomerCouponDto, 'id' | 'status'>;

export type IssueManyCustomerList = {
  customerId: number;
  couponId: number;
  status: CouponStatus;
};
