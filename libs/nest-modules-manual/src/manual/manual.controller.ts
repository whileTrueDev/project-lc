import { Controller, Get, Param, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { Manual } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { ManualService } from './manual.service';

// @UseInterceptors(HttpCacheInterceptor)
@Controller('manual')
export class ManualController {
  constructor(private readonly manualService: ManualService) {}

  @Get(':id')
  getOneManual(@Param('id', ParseIntPipe) id: number): Promise<Manual> {
    return this.manualService.getOneManualById(id);
  }
}
