import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { OverlayTheme } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard, AdminGuard } from '@project-lc/nest-modules-authguard';
import { OverlayThemeService } from '@project-lc/nest-modules-overlay-controller';
import { CreateOverlayThemeDto } from '@project-lc/shared-types';

@UseGuards(JwtAuthGuard, AdminGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('admin/overlay-theme')
@Controller('admin/overlay-theme')
export class AdminOverlayThemeController {
  constructor(private readonly themeService: OverlayThemeService) {}

  /** 오버레이 테마 목록 조회 */
  @Get('list')
  async getPolicyList(): Promise<OverlayTheme[]> {
    return this.themeService.getList();
  }

  /** 오버레이 테마 개별조회 */
  @Get()
  async getPolicy(@Query('id', ParseIntPipe) id: number): Promise<OverlayTheme> {
    return this.themeService.getTheme(id);
  }

  /** 오버레이 테마 생성 */
  @Post()
  async createPolicy(
    @Body(ValidationPipe) dto: CreateOverlayThemeDto,
  ): Promise<OverlayTheme> {
    return this.themeService.createTheme(dto);
  }

  /** 특정 오버레이 테마 삭제 */
  @Delete(':id')
  async deletePolicy(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.themeService.deleteTheme(id);
  }
}
