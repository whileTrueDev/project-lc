import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
  Param,
  Delete,
} from '@nestjs/common';
import { Coupon, CustomerCouponLog } from '@prisma/client';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  CouponService,
  CustomerCouponService,
  CouponLogService,
} from '@project-lc/nest-modules-coupon';
import { CouponDto } from '@project-lc/shared-types';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/coupon')
export class AdminCouponController {
  constructor(
    private readonly couponService: CouponService,
    private readonly couponLogService: CouponLogService,
  ) {}

  @Get()
  async getAllCoupons(): Promise<Coupon[]> {
    return this.couponService.findCoupons();
  }

  @Post()
  async createCoupon(@Body(ValidationPipe) dto: CouponDto): Promise<Coupon> {
    return this.couponService.createCoupon(dto);
  }

  @Patch()
  async updateCoupon(
    @Body(ValidationPipe) dto: CouponDto & { id: number },
  ): Promise<Coupon> {
    return this.couponService.updateCoupon(dto);
  }

  @Get('history')
  async getCouponLogs(): Promise<CustomerCouponLog[]> {
    return this.couponLogService.adminFindCouponLogs();
  }

  @Delete(':couponId')
  async deleteCoupon(@Param('couponId', ParseIntPipe) couponId: number): Promise<Coupon> {
    return this.couponService.deleteCoupon(couponId);
  }
}
