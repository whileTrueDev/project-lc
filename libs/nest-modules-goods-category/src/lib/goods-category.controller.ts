import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  CategoryOnGoodsConnectionDto,
  FindGoodsCategoryDto,
  GoodsCategoryRes,
  GoodsCategoryWithFamily,
} from '@project-lc/shared-types';
import { GoodsCategoryService } from './goods-category.service';

@Controller('goods-category')
@UseInterceptors(HttpCacheInterceptor)
export class GoodsCategoryController {
  constructor(private readonly goodsCategoryService: GoodsCategoryService) {}

  @UseGuards(JwtAuthGuard)
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
  ): Promise<boolean> {
    return this.goodsCategoryService.connectCategoryOnGoods(dto);
  }

  /** 특정 상품과 카테고리 연결 해제 */
  @Delete()
  async disconnectCategoryOnGoods(
    @Body(ValidationPipe) dto: CategoryOnGoodsConnectionDto,
  ): Promise<boolean> {
    return this.goodsCategoryService.disconnectCategoryOnGoods(dto);
  }

  /** 특정 카테고리 정보 조회(상위, 하위카테고리 정보 포함) */
  @Get(':categoryCode')
  public async getOneCategory(
    @Param('categoryCode') categoryCode: string,
  ): Promise<GoodsCategoryWithFamily> {
    return this.goodsCategoryService.findCategory(categoryCode);
  }
}
