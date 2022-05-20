import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CustomerCoupon } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { CustomerCouponService } from '@project-lc/nest-modules-coupon';
import { CouponStatusDto, CustomerCouponDto } from '@project-lc/shared-types';

@UseGuards(JwtAuthGuard, AdminGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('customer-coupon')
@Controller('admin/customer-coupon')
export class AdminCustomerCouponController {
  constructor(private readonly customerCouponService: CustomerCouponService) {}

  /** 모든 소비자 또는 특정 소비자의 모든 쿠폰 목록 조회 */
  @Get()
  async getAllCustomerCoupons(
    @Query('customerId') customerId?: number,
  ): Promise<CustomerCoupon[]> {
    return this.customerCouponService.findCustomerCoupons(customerId || undefined);
  }

  /** 쿠폰을 특정 소비자에게 발급 */
  @Post()
  async createCustomerCoupon(
    @Body(ValidationPipe) dto: CustomerCouponDto,
  ): Promise<CustomerCoupon> {
    return this.customerCouponService.createCustomerCoupon(dto);
  }

  /** 특정 소비자에게 발급된 쿠폰 목록 조회 */
  @Patch('/:customerCouponId')
  async updateCustomerCouponStatus(
    @Param('customerCouponId', ParseIntPipe) customerCouponId: number,
    @Body('status', ValidationPipe) status: CouponStatusDto['status'],
  ): Promise<CustomerCoupon> {
    return this.customerCouponService.updateCustomerCouponStatus({
      id: customerCouponId,
      status,
    });
  }

  /** 특정 소비자에게 발급된 쿠폰 삭제 */
  @Delete('/:customerCouponId')
  async deleteCustomerCoupon(
    @Param('customerCouponId', ParseIntPipe) customerCouponId: number,
  ): Promise<CustomerCoupon> {
    return this.customerCouponService.deleteCustomerCoupon(customerCouponId);
  }
}
