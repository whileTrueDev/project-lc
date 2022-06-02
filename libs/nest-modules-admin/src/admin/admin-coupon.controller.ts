import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Coupon, CustomerCouponLog } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { CouponLogService, CouponService } from '@project-lc/nest-modules-coupon';
import { CouponDto } from '@project-lc/shared-types';

@UseGuards(JwtAuthGuard, AdminGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('coupon')
@Controller('admin/coupon')
export class AdminCouponController {
  constructor(
    private readonly couponService: CouponService,
    private readonly couponLogService: CouponLogService,
  ) {}

  /** 모든 쿠폰 목록 조회 */
  @Get('list')
  async getAllCoupons(): Promise<Coupon[]> {
    return this.couponService.findCoupons();
  }

  /** 쿠폰 사용 내역 조회 */
  @Get('history')
  async getCouponLogs(): Promise<CustomerCouponLog[]> {
    return this.couponLogService.adminFindCouponLogs();
  }

  /** 하나의 쿠폰 조회 */
  @Get(':couponId')
  async getOneCoupon(
    @Param('couponId', ParseIntPipe) couponId: Coupon['id'],
  ): Promise<Coupon> {
    return this.couponService.findCoupon(couponId);
  }

  /** 쿠폰 생성 */
  @Post()
  async createCoupon(@Body() dto: CouponDto): Promise<Coupon> {
    console.log(dto);
    return this.couponService.createCoupon(dto);
  }

  /** 특정 쿠폰 수정 */
  @Patch(':couponId')
  async updateCoupon(
    @Param('couponId', ParseIntPipe) id: Coupon['id'],
    @Body(ValidationPipe) dto: CouponDto,
  ): Promise<Coupon> {
    return this.couponService.updateCoupon(id, dto);
  }

  /** 특정 쿠폰 삭제 */
  @Delete(':couponId')
  async deleteCoupon(
    @Param('couponId', ParseIntPipe) couponId: Coupon['id'],
  ): Promise<Coupon> {
    return this.couponService.deleteCoupon(couponId);
  }
}
