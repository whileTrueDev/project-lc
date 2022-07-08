import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { CustomerMileageLog } from '@prisma/client';

@Injectable()
export class MileageLogService {
  constructor(private readonly prismaService: PrismaService) {}

  /** 전체 혹은 특정 소비자의 마일리지 사용내역 조회 */
  findMileageLogs(customerId?: number): Promise<CustomerMileageLog[]> {
    return this.prismaService.customerMileageLog.findMany({
      where: { customerId: customerId || undefined },
      include: {
        customer: {
          select: {
            email: true,
          },
        },
      },
    });
  }
}
