import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
  Param,
  Delete,
} from '@nestjs/common';
import { Coupon, CustomerCoupon, CustomerCouponLog, CouponStatus } from '@prisma/client';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  CouponService,
  CustomerCouponService,
  CouponLogService,
} from '@project-lc/nest-modules-coupon';
import { CouponDto, CustomerCouponDto } from '@project-lc/shared-types';
// @UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/coupon')
export class AdminCouponController {
  constructor(
    private readonly couponService: CouponService,
    private readonly customerCouponService: CustomerCouponService,
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
  async updateCoupon(@Body(ValidationPipe) dto: CouponDto): Promise<Coupon> {
    return this.couponService.updateCoupon(dto);
  }

  @Get('history')
  async getCouponLogs(): Promise<CustomerCouponLog[]> {
    return this.couponLogService.adminFindCouponLogs();
  }

  @Delete(':couponId')
  async deleteCoupon(@Param('couponId', ParseIntPipe) couponId: number): Promise<Coupon> {
    return this.couponService.deleteCoupon({ couponId });
  }

  @Get('customer-coupon')
  async getAllCustomerCoupons(): Promise<CustomerCoupon[]> {
    return this.customerCouponService.findCustomerCoupons();
  }

  @Post('customer-coupon')
  async createCustomerCoupon(
    @Body(ValidationPipe) dto: CustomerCouponDto,
  ): Promise<CustomerCoupon> {
    return this.customerCouponService.createCustomerCoupon(dto);
  }

  @Get('customer-coupon/:customerId')
  async getCustomerCouponsByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<CustomerCoupon[]> {
    return this.customerCouponService.findCustomerCoupons({ customerId });
  }

  @Patch('customer-coupon/:customerCouponId')
  async updateCustomerCouponStatus(
    @Param('customerCouponId', ParseIntPipe) customerCouponId: number,
    @Body('status', ValidationPipe) status: CouponStatus,
  ): Promise<CustomerCoupon> {
    return this.customerCouponService.updateCustomerCouponStatus({
      status,
      customerCouponId,
    });
  }

  @Delete('customer-coupon/:customerCouponId')
  async deleteCustomerCoupon(
    @Param('customerCouponId', ParseIntPipe) customerCouponId: number,
  ): Promise<CustomerCoupon> {
    return this.customerCouponService.deleteCustomerCoupon({ customerCouponId });
  }
}
