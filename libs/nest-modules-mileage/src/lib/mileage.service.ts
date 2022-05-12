import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { CustomerMileage } from '@prisma/client';
import { UpsertDto } from '@project-lc/shared-types';

@Injectable()
export class MileageService {
  constructor(private readonly prismaService: PrismaService) {}

  async upsertMileage(dto: UpsertDto): Promise<CustomerMileage> {
    const mileageData = await this.findMileage(dto.customerId);

    if (
      mileageData &&
      dto.actionType === 'consume' &&
      dto.mileage > mileageData.mileage
    ) {
      throw new ForbiddenException(
        `사용하려는 적립금이 보유 적립금보다 더 큽니다. ${dto.customerId}`,
      );
    }

    const doUpsert = this.prismaService.customerMileage.upsert({
      where: {
        customerId: dto.customerId,
      },
      update: {
        mileage: { increment: dto.actionType === 'earn' ? dto.mileage : -dto.mileage },
      },
      create: {
        customerId: dto.customerId,
        mileage: dto.mileage,
      },
    });

    const doLog = this.prismaService.customerMileageLog.create({
      data: {
        customerId: dto.customerId,
        amount: dto.mileage,
        actionType: dto.actionType,
        reason: dto.reason,
        orderId: dto.orderId || undefined,
        reviewId: dto.reviewId || undefined,
      },
    });

    const [result] = await this.prismaService.$transaction([doUpsert, doLog]);
    return result;
  }

  findMileage(customerId: number): Promise<CustomerMileage> {
    return this.prismaService.customerMileage.findFirst({
      where: {
        customerId,
      },
    });
  }

  findAllMileage(): Promise<CustomerMileage[]> {
    return this.prismaService.customerMileage.findMany();
  }
}
