import { Injectable } from '@nestjs/common';
import { CustomerCouponLog } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class CouponLogService {
  constructor(private readonly prismaService: PrismaService) {}

  adminFindCouponLogs(): Promise<CustomerCouponLog[]> {
    return this.prismaService.customerCouponLog.findMany({});
  }

  async findCouponLogs(dto): Promise<CustomerCouponLog[]> {
    const query = await this.prismaService.customerCoupon.findMany({
      where: {
        customerId: dto.customerId,
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
