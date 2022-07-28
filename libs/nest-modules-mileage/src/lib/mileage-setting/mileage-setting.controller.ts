import {
  Controller,
  Get,
  UseInterceptors,
  Body,
  Patch,
  ValidationPipe,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { MileageSetting } from '@prisma/client';
import {
  HttpCacheInterceptor,
  CustomerInfo,
  UserPayload,
  CacheClearKeys,
} from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { MileageSettingUpdateDto } from '@project-lc/shared-types';
import { MileageSettingService } from './mileage-setting.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('mileage-setting')
@Controller('mileage-setting')
export class MileageSettingController {
  constructor(private readonly mileageSettingService: MileageSettingService) {}

  /** 전역 마일리지세팅 불러오기 */
  @Get('default')
  public getDefaultMileageSetting(): Promise<MileageSetting> {
    return this.mileageSettingService.getMileageSetting();
  }

  /** 마일리지 설정 수정 */
  @Patch(':id')
  public updateMileageSetting(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: MileageSettingUpdateDto,
  ): Promise<MileageSetting> {
    return this.mileageSettingService.updateMileageSetting({ id, ...dto });
  }
}
