import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { MileageSetting } from '@prisma/client';
import { MileageSettingDto, MileageSettingUpdateDto } from '@project-lc/shared-types';

@Injectable()
export class MileageSettingService {
  constructor(private readonly prismaService: PrismaService) {}

  /** 마일리지 설정 조회 */
  getMileageSetting(): Promise<MileageSetting> {
    return this.prismaService.mileageSetting.findFirst();
  }

  /** 마일리지 설정 생성 */
  createMileageSetting(dto: MileageSettingDto): Promise<MileageSetting> {
    return this.prismaService.mileageSetting.create({
      data: {
        defaultMileagePercent: dto.defaultMileagePercent,
        mileageStrategy: dto.mileageStrategy,
      },
    });
  }

  /** 마일리지 설정 수정 */
  updateMileageSetting(
    dto: MileageSettingUpdateDto & { id: number },
  ): Promise<MileageSetting> {
    return this.prismaService.mileageSetting.update({
      where: { id: dto.id },
      data: {
        defaultMileagePercent: dto.defaultMileagePercent,
        mileageStrategy: dto.mileageStrategy,
        useMileageFeature: dto.useMileageFeature,
      },
    });
  }
}
