import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, AdminGuard } from '@project-lc/nest-modules-authguard';
import { KkshowMainService } from '@project-lc/nest-modules-kkshow-main';
import { KkshowMainResData, KkshowMainDto } from '@project-lc/shared-types';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/kkshow-main')
export class AdminKkshowMainController {
  constructor(private readonly kkshowMainService: KkshowMainService) {}

  /** ================================= */
  // 크크쇼메인페이지 관리
  /** ================================= */
  @Get()
  async getMainPageData(): Promise<KkshowMainResData | null> {
    return this.kkshowMainService.read();
  }

  @Post()
  async upsertMainPageData(@Body() data: KkshowMainDto): Promise<KkshowMainResData> {
    return this.kkshowMainService.upsert(data);
  }
}
