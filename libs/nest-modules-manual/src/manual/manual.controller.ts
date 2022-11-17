import { Controller, Get, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { Manual, UserType } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { ManualListRes } from '@project-lc/shared-types';
import { ManualService } from './manual.service';

@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('manual')
@Controller('manual')
export class ManualController {
  constructor(private readonly manualService: ManualService) {}

  /** 이용안내 목록조회(컨텐츠는 조회하지 않음) */
  @Get('list')
  getManualList(@Query('target') target: UserType): Promise<ManualListRes> {
    return this.manualService.getManualListPartial(target);
  }

  /** id로 이용안내 데이터 조회 */
  @Get()
  getManualById(@Query('id', ParseIntPipe) id: number): Promise<Manual> {
    return this.manualService.getManualById(id);
  }

  /** 특정 페이지의 routerPath(페이지 url)와 userType(판매자/방송인)으로 이용안내 id 조회 -> 각 페이지별 매뉴얼 링크 사용 위함 */
  @Get('id')
  getManualByRouterPath(
    @Query('routerPath') routerPath: string,
    @Query('userType') userType: UserType,
  ): Promise<number | null> {
    return this.manualService.getManualByRouterPath({ routerPath, userType });
  }
}
