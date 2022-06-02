import { Injectable } from '@nestjs/common';
import { CustomerCouponLog } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CustomerCouponDto } from '@project-lc/shared-types';

@Injectable()
export class CouponLogService {
  constructor(private readonly prismaService: PrismaService) {}

  /** 모든 쿠폰 사용 내역 조회 */
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
    customerId: CustomerCouponDto['customerId'],
  ): Promise<CustomerCouponLog[]> {
    const query = await this.prismaService.customerCoupon.findMany({
      where: { customerId },
      select: { logs: true },
    });

    const result = query.flatMap((item) => item.logs);
    return result;
  }
}
