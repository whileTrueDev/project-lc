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
import { CustomerCoupon } from '@prisma/client';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  CouponService,
  CustomerCouponService,
  CouponLogService,
} from '@project-lc/nest-modules-coupon';
import { CustomerCouponDto, CouponStatusDto } from '@project-lc/shared-types';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/customer-coupon')
export class AdminCustomerCouponController {
  constructor(
    private readonly couponService: CouponService,
    private readonly customerCouponService: CustomerCouponService,
    private readonly couponLogService: CouponLogService,
  ) {}

  @Get()
  async getAllCustomerCoupons(): Promise<CustomerCoupon[]> {
    return this.customerCouponService.findCustomerCoupons();
  }

  @Post()
  async createCustomerCoupon(
    @Body(ValidationPipe) dto: CustomerCouponDto,
  ): Promise<CustomerCoupon> {
    return this.customerCouponService.createCustomerCoupon(dto);
  }

  @Get('/:customerId')
  async getCustomerCouponsByCustomerId(
    @Param('customerId', ParseIntPipe) customerId: number,
  ): Promise<CustomerCoupon[]> {
    return this.customerCouponService.findCustomerCoupons(customerId);
  }

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

  @Delete('/:customerCouponId')
  async deleteCustomerCoupon(
    @Param('customerCouponId', ParseIntPipe) customerCouponId: number,
  ): Promise<CustomerCoupon> {
    return this.customerCouponService.deleteCustomerCoupon(customerCouponId);
  }
}
