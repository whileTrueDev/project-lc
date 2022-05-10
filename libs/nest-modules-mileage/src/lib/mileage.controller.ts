import {
  Controller,
  Get,
  UseInterceptors,
  Body,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import { HttpCacheInterceptor, UserInfo, UserPayload } from '@project-lc/nest-core';
import { CustomerMileage, CustomerMileageLog } from '@prisma/client';
import { UpsertDto } from '@project-lc/shared-types';
import { MileageService } from './mileage.service';
import { MileageLogService } from './mileage-log.service';

@UseInterceptors(HttpCacheInterceptor)
@Controller('mileage')
export class MileageController {
  constructor(
    private readonly mileageService: MileageService,
    private readonly mileageLogService: MileageLogService,
  ) {}

  @Get()
  getOneMileage(@UserInfo() { id }: UserPayload): Promise<CustomerMileage> {
    return this.mileageService.findMileage(id);
  }

  @Patch()
  upsertOneMileage(@Body(ValidationPipe) dto: UpsertDto): Promise<CustomerMileage> {
    return this.mileageService.upsertMileage(dto);
  }

  @Get('history')
  getMileageLogs(@UserInfo() { id }: UserPayload): Promise<CustomerMileageLog[]> {
    return this.mileageLogService.findMileageLogs(id);
  }
}
