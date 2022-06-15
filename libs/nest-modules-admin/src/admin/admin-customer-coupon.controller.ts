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
import {
  CouponStatusDto,
  CustomerCouponDto,
  CustomerCouponRes,
} from '@project-lc/shared-types';
import { CustomerService } from '@project-lc/nest-modules-customer';

@UseGuards(JwtAuthGuard, AdminGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('customer-coupon')
@Controller('admin/customer-coupon')
export class AdminCustomerCouponController {
  constructor(
    private readonly customerCouponService: CustomerCouponService,
    private readonly customerService: CustomerService,
  ) {}

  /** 모든 소비자 또는 특정 소비자의 모든 쿠폰 목록 조회 */
  @Get()
  async getAllCustomerCoupons(
    @Query('customerId') customerId?: number,
    @Query('couponId') couponId?: number,
  ): Promise<CustomerCouponRes[]> {
    return this.customerCouponService.findCustomerCoupons(
      { customerId, couponId } || undefined,
    );
  }

  /** 쿠폰을 특정 소비자에게 발급 */
  @Post()
  async createCustomerCoupon(
    @Body(ValidationPipe) dto: CustomerCouponDto,
  ): Promise<CustomerCoupon> {
    return this.customerCouponService.createCustomerCoupon(dto);
  }

  /** 쿠폰을 특정 소비자에게 발급 */
  @Post('/all')
  async createAllCustomerCoupon(
    @Body(ValidationPipe) dto: CustomerCouponDto,
  ): Promise<number> {
    if (dto.customerIds.length) {
      return this.customerCouponService.createAllCustomerCoupon(dto); // customers
    }
    const customers = await this.customerService.findAll();
    return this.customerCouponService.createAllCustomerCoupon(dto, customers); //
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
