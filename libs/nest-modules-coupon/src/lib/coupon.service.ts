import { Injectable } from '@nestjs/common';
import { Coupon } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CouponDto } from '@project-lc/shared-types';

@Injectable()
export class CouponService {
  constructor(private readonly prismaService: PrismaService) {}

  /** 쿠폰 상세조회 */
  findCoupon(couponId: number): Promise<Coupon> {
    return this.prismaService.coupon.findFirst({
      where: {
        id: couponId,
      },
      include: {
        customerCoupons: {
          include: {
            customer: {
              select: {
                email: true,
                nickname: true,
              },
            },
            logs: true,
          },
        },
      },
    });
  }

  /** 쿠폰 목록 조회 */
  findCoupons(): Promise<Coupon[]> {
    return this.prismaService.coupon.findMany();
  }

  /** 쿠폰 생성 */
  createCoupon(dto: CouponDto): Promise<Coupon> {
    return this.prismaService.coupon.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      },
    });
  }

  /** 특정 쿠폰 수정 */
  updateCoupon(id: number, dto: CouponDto): Promise<Coupon> {
    return this.prismaService.coupon.update({
      where: { id },
      data: { ...dto },
    });
  }

  /** 특정 쿠폰 제거 */
  deleteCoupon(couponId: number): Promise<Coupon> {
    return this.prismaService.coupon.delete({
      where: { id: couponId },
    });
  }
}
