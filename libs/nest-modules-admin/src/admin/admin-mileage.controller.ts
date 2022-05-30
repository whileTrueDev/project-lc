import {
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { CustomerMileage, CustomerMileageLog, MileageSetting } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  MileageService,
  MileageLogService,
  MileageSettingService,
} from '@project-lc/nest-modules-mileage';
import { MileageSettingDto, CustomerMileageDto } from '@project-lc/shared-types';

@UseGuards(JwtAuthGuard, AdminGuard)
// @UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('mileage')
@Controller('admin/mileage')
export class AdminMileageController {
  constructor(
    private readonly mileageService: MileageService,
    private readonly mileageLogService: MileageLogService,
    private readonly mileageSettingService: MileageSettingService,
  ) {}

  /** 존재하는 모든 마일리지 불러오기 */
  @Get()
  findAll(): Promise<CustomerMileage[]> {
    return this.mileageService.findAllMileage();
  }

  /** 특정 소비자 마일리지 업데이트 / 마일리지 로우 없으면 insert */
  @Patch('/:customerId')
  updateMileage(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body(ValidationPipe) dto: CustomerMileageDto,
  ): Promise<CustomerMileage> {
    return this.mileageService.upsertMileage({ customerId, ...dto });
  }

  /** 마일리지 로그 */
  @Get('history')
  getMileageLogs(): Promise<CustomerMileageLog[]> {
    return this.mileageLogService.findMileageLogs();
  }

  /** 마일리지 세팅 불러오기 */
  @Get('setting')
  getMileageSettings(): Promise<MileageSetting> {
    return this.mileageSettingService.getMileageSetting();
  }

  /** 마일리지 세팅 생성 */
  @Post('setting')
  createMileageSetting(
    @Body(ValidationPipe) dto: MileageSettingDto,
  ): Promise<MileageSetting> {
    return this.mileageSettingService.createMileageSetting(dto);
  }

  /** 마일리지 세팅 업데이트 */
  @Patch('setting/:id')
  updateMileageSetting(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: MileageSettingDto,
  ): Promise<MileageSetting> {
    return this.mileageSettingService.updateMileageSetting({ id, ...dto });
  }
}
