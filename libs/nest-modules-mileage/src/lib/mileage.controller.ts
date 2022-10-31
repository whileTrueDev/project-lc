import {
  Controller,
  Get,
  UseInterceptors,
  Body,
  Patch,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  HttpCacheInterceptor,
  CustomerInfo,
  UserPayload,
  CacheClearKeys,
} from '@project-lc/nest-core';
import { CustomerMileage, CustomerMileageLog } from '@prisma/client';
import { CustomerMileageDto } from '@project-lc/shared-types';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { MileageService } from './mileage.service';
import { MileageLogService } from './mileage-log.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('mileage')
@Controller('mileage')
export class MileageController {
  constructor(
    private readonly mileageService: MileageService,
    private readonly mileageLogService: MileageLogService,
  ) {}

  /** 특정 소비자의 마일리지 정보 조회 */
  @Get()
  getOneMileage(@CustomerInfo() { id }: UserPayload): Promise<CustomerMileage> {
    return this.mileageService.findMileage(id);
  }

  /** 특정 소비자의 마일리지 정보 수정(마일리지 사용 처리) */
  @Patch()
  upsertOneMileage(
    @CustomerInfo() { id }: UserPayload,
    @Body(ValidationPipe) dto: CustomerMileageDto,
  ): Promise<CustomerMileage> {
    return this.mileageService.upsertMileage({ customerId: id, ...dto });
  }

  /** 특정 소비자의 마일리지 사용 내역 조회 */
  @Get('history')
  getMileageLogs(@CustomerInfo() { id }: UserPayload): Promise<CustomerMileageLog[]> {
    return this.mileageLogService.findMileageLogs(id);
  }
}
