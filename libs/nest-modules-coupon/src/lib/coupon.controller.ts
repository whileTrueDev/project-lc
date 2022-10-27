import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CustomerCoupon } from '@prisma/client';
import {
  CacheClearKeys,
  CustomerInfo,
  HttpCacheInterceptor,
  UserPayload,
} from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  CouponStatusDto,
  CustomerCouponLogRes,
  CustomerCouponRes,
} from '@project-lc/shared-types';
import { CouponLogService } from './coupon-log.service';
import { CustomerCouponService } from './customer-coupon.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('coupon', 'customer-coupon')
@Controller('coupon')
export class CouponController {
  constructor(
    private readonly customerCouponService: CustomerCouponService,
    private readonly couponLogService: CouponLogService,
  ) {}

  /** 특정 소비자에게 발급된 쿠폰 목록을 조회합니다 */
  @Get()
  getCustomerCoupons(@CustomerInfo() { id }: UserPayload): Promise<CustomerCouponRes[]> {
    return this.customerCouponService.findCustomerCoupons({
      customerId: id,
      couponId: null,
    });
  }

  /** 특정 소비자에 대한 쿠폰발급, 사용내역을 조회합니다  */
  @Get('history')
  async getCouponLogs(
    @CustomerInfo() { id }: UserPayload,
  ): Promise<CustomerCouponLogRes[]> {
    return this.couponLogService.findCouponLogs(id);
  }

  /** 소비자에게 발급된 특정 쿠폰 정보를 조회합니다 */
  @Get(':customerCouponId')
  getCustomerCouponByCouponId(
    @Param('customerCouponId', ParseIntPipe) customerCouponId: number,
  ): Promise<CustomerCoupon> {
    return this.customerCouponService.findCustomerCoupon(customerCouponId);
  }

  /** 소비자에게 발급된 특정 쿠폰의 상태(사용여부)를 변경합니다 */
  @Patch('/:customerCouponId')
  updateCustomerCouponStatus(
    @Param('customerCouponId', ParseIntPipe) customerCouponId: number,
    @Body('status', ValidationPipe) status: CouponStatusDto['status'],
  ): Promise<CustomerCoupon> {
    return this.customerCouponService.updateCustomerCouponStatus({
      id: customerCouponId,
      status,
    });
  }
}
