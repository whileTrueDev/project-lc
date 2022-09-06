import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { KkshowBcList } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { KkshowBcListService } from './kkshow-bc-list.service';

@Controller('kkshow-bc-list')
export class KkshowBcListController {
  constructor(private readonly kkshowBcListService: KkshowBcListService) {}

  @UseInterceptors(HttpCacheInterceptor)
  @Get()
  public getKkshowBcList(): Promise<KkshowBcList[]> {
    return this.kkshowBcListService.findAll();
  }
}
