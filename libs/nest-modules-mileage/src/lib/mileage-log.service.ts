import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { CustomerMileageLog } from '@prisma/client';

@Injectable()
export class MileageLogService {
  constructor(private readonly prismaService: PrismaService) {}

  findMileageLogs(customerId?: number): Promise<CustomerMileageLog[]> {
    return this.prismaService.customerMileageLog.findMany({
      where: {
        customerId: customerId || undefined,
      },
    });
  }
}
