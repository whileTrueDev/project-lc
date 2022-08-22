import { CouponStatus } from '@prisma/client';
import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CouponStatusDto {
  @IsNumber()
  id: number;

  @IsEnum(CouponStatus)
  status: CouponStatus;

  /** 쿠폰 사용시 사용된 주문 고유번호 */
  @IsOptional()
  @IsNumber()
  orderId?: number;
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
