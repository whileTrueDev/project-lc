import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { FindGoodsCategoryDto, GoodsCategoryRes } from '@project-lc/shared-types';
import { GoodsCategoryService } from './goods-category.service';

@Controller('goods-category')
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
}
