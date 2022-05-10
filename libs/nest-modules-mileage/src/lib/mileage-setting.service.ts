import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { MileageSetting } from '@prisma/client';
import { MileageSettingDto } from '@project-lc/shared-types';

@Injectable()
export class MileageSettingService {
  constructor(private readonly prismaService: PrismaService) {}

  getMileageSettings(): Promise<MileageSetting[]> {
    return this.prismaService.mileageSetting.findMany();
  }

  createMileageSetting(dto: MileageSettingDto): Promise<MileageSetting> {
    return this.prismaService.mileageSetting.create({
      data: {
        defaultMileagePercent: dto.defaultMileagePercent,
        mileageStrategy: dto.mileageStrategy,
      },
    });
  }

  updateMileageSetting(dto: MileageSettingDto): Promise<MileageSetting> {
    return this.prismaService.mileageSetting.update({
      where: {
        id: dto.id,
      },
      data: {
        defaultMileagePercent: dto.defaultMileagePercent || undefined,
        mileageStrategy: dto.mileageStrategy || undefined,
      },
    });
  }
}
