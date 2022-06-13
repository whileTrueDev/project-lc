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
  HttpCacheInterceptor,
  UserPayload,
  CustomerInfo,
  CacheClearKeys,
} from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { CouponStatusDto } from '@project-lc/shared-types';
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

  @Get()
  getCustomerCoupons(@CustomerInfo() { id }: UserPayload): Promise<CustomerCoupon[]> {
    return this.customerCouponService.findCustomerCoupons({
      customerId: id,
      couponId: null,
    });
  }

  @Get('history')
  async getCouponLogs(@CustomerInfo() { id }: UserPayload): Promise<CustomerCoupon[]> {
    return this.couponLogService.findCouponLogs(id);
  }

  @Get(':customerCouponId')
  getCustomerCouponByCouponId(
    @Param('customerCouponId', ParseIntPipe) customerCouponId: number,
  ): Promise<CustomerCoupon> {
    return this.customerCouponService.findCustomerCoupon(customerCouponId);
  }

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
