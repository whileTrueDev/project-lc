import { Injectable } from '@nestjs/common';
import { Coupon } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class CouponService {
  constructor(private readonly prismaService: PrismaService) {}

  findCoupons(): Promise<Coupon[]> {
    return this.prismaService.coupon.findMany();
  }

  createCoupon(dto): Promise<Coupon> {
    return this.prismaService.coupon.create({
      data: {
        ...dto,
      },
    });
  }

  updateCoupon(dto): Promise<Coupon> {
    const { id, ...updateData } = dto;
    return this.prismaService.coupon.update({
      where: { id },
      data: {
        ...updateData,
      },
    });
  }

  deleteCoupon(dto): Promise<Coupon> {
    return this.prismaService.coupon.delete({
      where: {
        id: dto.couponId,
      },
    });
  }
}
