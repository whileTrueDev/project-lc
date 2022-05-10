import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseInterceptors,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { HttpCacheInterceptor, UserInfo, UserPayload } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { CustomerCoupon, CustomerCouponLog, CouponStatus } from '@prisma/client';
import { CustomerCouponService } from './customer-coupon.service';
import { CouponLogService } from './coupon-log.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@Controller('coupon')
export class CouponController {
  constructor(
    private readonly customerCouponService: CustomerCouponService,
    private readonly couponLogService: CouponLogService,
  ) {}

  @Get()
  getCustomerCoupons(@UserInfo() { id }: UserPayload): Promise<CustomerCoupon[]> {
    return this.customerCouponService.findCustomerCoupons(id);
  }

  @Get('history')
  async getCouponLogs(): Promise<CustomerCouponLog[]> {
    const id = 1;
    return this.couponLogService.findCouponLogs(id);
  }

  @Get(':customerCouponId')
  getCustomerCouponByCouponId(
    @Param('customerCouponId', ParseIntPipe) customerCouponId: number,
  ): Promise<CustomerCoupon> {
    return this.customerCouponService.findCustomerCoupon(customerCouponId);
  }

  @Patch()
  updateCustomerCouponStatus(
    @Param('customerCouponId', ParseIntPipe) customerCouponId: number,
    @Body('status', ValidationPipe) status: CouponStatus,
  ): Promise<CustomerCoupon> {
    return this.customerCouponService.updateCustomerCouponStatus({
      id: customerCouponId,
      status,
    });
  }
}
