import {
  Controller,
  Get,
  UseInterceptors,
  Body,
  Patch,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { HttpCacheInterceptor, CustomerInfo, UserPayload } from '@project-lc/nest-core';
import { CustomerMileage, CustomerMileageLog } from '@prisma/client';
import { CustomerMileageDto } from '@project-lc/shared-types';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { MileageService } from './mileage.service';
import { MileageLogService } from './mileage-log.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@Controller('mileage')
export class MileageController {
  constructor(
    private readonly mileageService: MileageService,
    private readonly mileageLogService: MileageLogService,
  ) {}

  @Get()
  getOneMileage(@CustomerInfo() { id }: UserPayload): Promise<CustomerMileage> {
    return this.mileageService.findMileage(id);
  }

  @Patch('/:customerId')
  upsertOneMileage(
    @CustomerInfo() { id }: UserPayload,
    @Body(ValidationPipe) dto: CustomerMileageDto,
  ): Promise<CustomerMileage> {
    return this.mileageService.upsertMileage({ customerId: id, ...dto });
  }

  @Get('history')
  getMileageLogs(@CustomerInfo() { id }: UserPayload): Promise<CustomerMileageLog[]> {
    return this.mileageLogService.findMileageLogs(id);
  }
}
