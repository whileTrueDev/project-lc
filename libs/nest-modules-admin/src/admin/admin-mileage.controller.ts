import {
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
  Body,
  Patch,
} from '@nestjs/common';
import { CustomerMileage, CustomerMileageLog, MileageSetting } from '@prisma/client';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  MileageService,
  MileageLogService,
  MileageSettingService,
} from '@project-lc/nest-modules-mileage';
import { MileageSettingDto } from '@project-lc/shared-types';

// @UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/mileage')
export class AdminMileageController {
  constructor(
    private readonly mileageService: MileageService,
    private readonly mileageLogService: MileageLogService,
    private readonly mileageSettingService: MileageSettingService,
  ) {}

  @Get()
  findAll(): Promise<CustomerMileage[]> {
    return this.mileageService.findAllMileage();
  }

  @Patch()
  updateMileage(@Body(ValidationPipe) dto): Promise<CustomerMileage> {
    return this.mileageService.upsertMileage(dto);
  }

  @Get('history')
  getMileageLogs(): Promise<CustomerMileageLog[]> {
    return this.mileageLogService.findMileageLogs();
  }

  @Get('setting')
  getMileageSettings(): Promise<MileageSetting[]> {
    return this.mileageSettingService.getMileageSettings();
  }

  @Post('setting')
  createMileageSetting(
    @Body(ValidationPipe) dto: MileageSettingDto,
  ): Promise<MileageSetting> {
    return this.mileageSettingService.createMileageSetting(dto);
  }

  @Patch('setting')
  updateMileageSetting(
    @Body(ValidationPipe) dto: MileageSettingDto,
  ): Promise<MileageSetting> {
    return this.mileageSettingService.updateMileageSetting(dto);
  }
}
