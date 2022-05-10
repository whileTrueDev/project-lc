import { Injectable } from '@nestjs/common';
import { CustomerCouponLog } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CustomerCouponDto } from '@project-lc/shared-types';

@Injectable()
export class CouponLogService {
  constructor(private readonly prismaService: PrismaService) {}

  adminFindCouponLogs(): Promise<CustomerCouponLog[]> {
    return this.prismaService.customerCouponLog.findMany({});
  }

  async findCouponLogs(
    customerId: CustomerCouponDto['customerId'],
  ): Promise<CustomerCouponLog[]> {
    const query = await this.prismaService.customerCoupon.findMany({
      where: {
        customerId,
      },
      select: {
        logs: {
          select: {
            id: true,
            customerCouponId: true,
            type: true,
            createDate: true,
          },
        },
      },
    });

    const result = query.map((item) => item.logs);

    const flatResult = result.reduce((a, b) => {
      return a.concat(b);
    }, []);

    return flatResult;
  }
}
