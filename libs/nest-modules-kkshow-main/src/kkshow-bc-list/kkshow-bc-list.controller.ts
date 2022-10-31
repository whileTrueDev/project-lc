import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { KkshowBcList } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { KkshowBcListService } from './kkshow-bc-list.service';

@Controller('kkshow-bc-list')
export class KkshowBcListController {
  constructor(private readonly kkshowBcListService: KkshowBcListService) {}

  /** 크크쇼.com/bc에 표시할 방송인 목록 조회 */
  @UseInterceptors(HttpCacheInterceptor)
  @Get()
  public getKkshowBcList(): Promise<KkshowBcList[]> {
    return this.kkshowBcListService.findAll();
  }
}
