import { Controller, Get, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { Manual, UserType } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { ManualListRes } from '@project-lc/shared-types';
import { ManualService } from './manual.service';

@UseInterceptors(HttpCacheInterceptor)
@Controller('manual')
export class ManualController {
  constructor(private readonly manualService: ManualService) {}

  /** 이용안내 목록조회(컨텐츠는 조회하지 않음) */
  @Get('list')
  getManualList(@Query('target') target: UserType): Promise<ManualListRes> {
    return this.manualService.getManualListPartial(target);
  }

  /** 이용안내 id로 조회 */
  @Get()
  getManualById(@Query('id', ParseIntPipe) id: number): Promise<Manual> {
    return this.manualService.getManualById(id);
  }
}
