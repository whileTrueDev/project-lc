import { Injectable } from '@nestjs/common';
import { CustomerCoupon, CustomerCouponLog } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CustomerCouponLogRes } from '@project-lc/shared-types';

@Injectable()
export class CouponLogService {
  constructor(private readonly prismaService: PrismaService) {}

  /** (관리자 모듈에서 사용)모든 쿠폰 사용 내역 조회 */
  adminFindCouponLogs(): Promise<CustomerCouponLog[]> {
    return this.prismaService.customerCouponLog.findMany({
      include: {
        customerCoupon: {
          include: {
            coupon: true,
            customer: true,
          },
        },
      },
    });
  }

  /** 특정 소비자의 쿠폰 사용 내역 조회 */
  async findCouponLogs(
    customerId: CustomerCoupon['customerId'],
  ): Promise<CustomerCouponLogRes[]> {
    return this.prismaService.customerCouponLog.findMany({
      where: { customerCoupon: { customerId } },
      include: {
        customerCoupon: {
          select: {
            coupon: { select: { name: true } },
          },
        },
      },
    });
  }
}
