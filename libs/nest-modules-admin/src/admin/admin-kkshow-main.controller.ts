import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { KkshowShoppingTabCategory } from '@prisma/client';
import { HttpCacheInterceptor, CacheClearKeys } from '@project-lc/nest-core';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  KkshowMainService,
  KkshowShoppingCategoryService,
  KkshowShoppingService,
} from '@project-lc/nest-modules-kkshow-main';
import {
  KkshowMainDto,
  KkshowMainResData,
  KkshowShoppingDto,
  KkshowShoppingTabCategoryDto,
  KkshowShoppingTabResData,
} from '@project-lc/shared-types';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminKkshowMainController {
  constructor(
    private readonly kkshowMainService: KkshowMainService,
    private readonly kkshowShoppingService: KkshowShoppingService,
    private readonly kkshowShoppingCategoryService: KkshowShoppingCategoryService,
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
  // 크크쇼 쇼핑페이지 관리
  /** ================================= */
  @Get('kkshow-shopping')
  async getShoppingPageData(): Promise<KkshowShoppingTabResData | null> {
    return this.kkshowShoppingService.read();
  }

  @Put('kkshow-shopping')
  async upsertShoppingPageData(
    @Body() data: KkshowShoppingDto,
  ): Promise<KkshowShoppingTabResData> {
    return this.kkshowShoppingService.upsert(data);
  }

  // 쇼핑페이지 카테고리 목록 요소 추가
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('goods-category', 'goods')
  @Post('kkshow-shopping/category')
  async addCategory(
    @Body(new ValidationPipe({ transform: true })) dto: KkshowShoppingTabCategoryDto,
  ): Promise<KkshowShoppingTabCategory> {
    return this.kkshowShoppingCategoryService.add(dto.categoryCode);
  }

  // 쇼핑페이지 카테고리 목록 요소 제거
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('goods-category', 'goods')
  @Delete('kkshow-shopping/category/:categoryCode')
  async removeCategory(
    @Param(new ValidationPipe({ transform: true })) dto: KkshowShoppingTabCategoryDto,
  ): Promise<boolean> {
    return this.kkshowShoppingCategoryService.remove(dto.categoryCode);
  }
}
