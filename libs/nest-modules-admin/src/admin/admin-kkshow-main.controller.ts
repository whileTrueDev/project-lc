import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, AdminGuard } from '@project-lc/nest-modules-authguard';
import {
  KkshowMainService,
  KkshowShoppingService,
} from '@project-lc/nest-modules-kkshow-main';
import {
  KkshowMainResData,
  KkshowMainDto,
  KkshowShoppingTabResData,
} from '@project-lc/shared-types';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminKkshowMainController {
  constructor(
    private readonly kkshowMainService: KkshowMainService,
    private readonly kkshowShoppingService: KkshowShoppingService,
  ) {}

  /** ================================= */
  // 크크쇼메인페이지 관리
  /** ================================= */
  @Get('kkshow-main')
  async getMainPageData(): Promise<KkshowMainResData | null> {
    return this.kkshowMainService.read();
  }

  @Post('kkshow-main')
  async upsertMainPageData(@Body() data: KkshowMainDto): Promise<KkshowMainResData> {
    return this.kkshowMainService.upsert(data);
  }

  /** ================================= */
  // 크크쇼메인페이지 관리
  /** ================================= */
  @Get('kkshow-shopping')
  async getShoppingPageData(): Promise<KkshowShoppingTabResData | null> {
    return this.kkshowShoppingService.read();
  }

  // @Post('kkshow-shopping')
  // async upsertShoppingPageData(@Body() data: KkshowMainDto): Promise<KkshowMainResData> {
  //   return this.kkshowShoppingService.upsert(data);
  // }
}
