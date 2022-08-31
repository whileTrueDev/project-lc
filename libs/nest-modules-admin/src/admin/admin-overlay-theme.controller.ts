import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { OverlayThemeService } from '@project-lc/nest-modules-overlay-controller';
import { CreateOverlayThemeDto } from '@project-lc/shared-types';

// @UseGuards(JwtAuthGuard, AdminGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('admin/overlay-theme')
@Controller('admin/overlay-theme')
export class AdminOverlayThemeController {
  constructor(private readonly themeService: OverlayThemeService) {}

  /** 목록 조회 */
  @Get('list')
  async getPolicyList(): Promise<any> {
    return this.themeService.getList();
  }

  /** 개별조회 */
  @Get()
  async getPolicy(@Query('id', ParseIntPipe) id: number): Promise<any> {
    return this.themeService.getTheme(id);
  }

  @Post()
  async createPolicy(@Body(ValidationPipe) dto: CreateOverlayThemeDto): Promise<any> {
    return this.themeService.createTheme(dto);
  }

  @Delete(':id')
  async deletePolicy(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.themeService.deleteTheme(id);
  }
}
