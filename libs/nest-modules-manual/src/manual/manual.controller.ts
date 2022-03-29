import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { Manual, UserType } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { ManualService } from './manual.service';

@UseInterceptors(HttpCacheInterceptor)
@Controller('manual')
export class ManualController {
  constructor(private readonly manualService: ManualService) {}

  @Get('list')
  getManualList(@Query('target') target: UserType): Promise<Manual[]> {
    return this.manualService.getManualList(target);
  }
}
