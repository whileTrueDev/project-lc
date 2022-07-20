import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  CategoryOnGoodsConnectionDto,
  FindGoodsCategoryDto,
  GoodsCategoryRes,
} from '@project-lc/shared-types';
import { GoodsCategoryService } from './goods-category.service';

@Controller('goods-category')
@CacheClearKeys('goods')
@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
export class GoodsCategoryController {
  constructor(private readonly goodsCategoryService: GoodsCategoryService) {}

  @Get()
  async getCategories(
    @Query(new ValidationPipe({ transform: true })) dto: FindGoodsCategoryDto,
  ): Promise<GoodsCategoryRes> {
    if (dto.parentCategoryId) {
      return this.goodsCategoryService.findChildCategories(dto.parentCategoryId);
    }
    if (dto.mainCategoryFlag) return this.goodsCategoryService.findMainCategories();
    return [];
  }

  /**
   * 특정 상품과 카테고리 연결 생성
   */
  @Post()
  async connectCategoryOnGoods(
    @Body(ValidationPipe) dto: CategoryOnGoodsConnectionDto,
  ): Promise<any> {
    return this.goodsCategoryService.connectCategoryOnGoods(dto);
  }

  /** 특정 상품과 카테고리 연결 해제 */
  @Delete()
  async disconnectCategoryOnGoods(
    @Body(ValidationPipe) dto: CategoryOnGoodsConnectionDto,
  ): Promise<any> {
    return this.goodsCategoryService.disconnectCategoryOnGoods(dto);
  }
}
