import { Controller, Get, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { Manual } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { ManualService } from './manual.service';

@UseInterceptors(HttpCacheInterceptor)
@Controller('manual')
export class ManualController {
  constructor(private readonly manualService: ManualService) {}

  @Get('')
  getOneManual(@Query('id', ParseIntPipe) id: number): Promise<Manual> {
    return this.manualService.getOneManualById(id);
  }
}
