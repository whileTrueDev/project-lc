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

export type CustomerCouponIdAndStatus = Pick<CustomerCouponDto, 'id' | 'status'>;
