import { Injectable } from '@nestjs/common';
import { Coupon } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CouponDto } from '@project-lc/shared-types';

@Injectable()
export class CouponService {
  constructor(private readonly prismaService: PrismaService) {}

  findCoupons(): Promise<Coupon[]> {
    return this.prismaService.coupon.findMany();
  }

  createCoupon(dto: CouponDto): Promise<Coupon> {
    return this.prismaService.coupon.create({
      data: {
        ...dto,
      },
    });
  }

  updateCoupon(dto: CouponDto & { id: number }): Promise<Coupon> {
    const { id, ...updateData } = dto;
    return this.prismaService.coupon.update({
      where: { id },
      data: {
        ...updateData,
      },
    });
  }

  deleteCoupon(couponId: number): Promise<Coupon> {
    return this.prismaService.coupon.delete({
      where: {
        id: couponId,
      },
    });
  }
}
