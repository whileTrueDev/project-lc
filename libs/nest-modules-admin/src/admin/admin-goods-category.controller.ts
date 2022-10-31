import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { GoodsCategory } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { GoodsCategoryService } from '@project-lc/nest-modules-goods-category';
import {
  CreateGoodsCategoryDto,
  AdminGoodsCategoryRes,
  UpdateGoodsCategoryDto,
} from '@project-lc/shared-types';

/** ================================= */
// 카테고리 GoodsCaregory
/** ================================= */
@UseGuards(JwtAuthGuard, AdminGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('goods-category', 'goods')
@Controller('admin/goods-category')
export class AdminGoodsCategoryController {
  constructor(private readonly categoryService: GoodsCategoryService) {}

  /** 전체 상품 카테고리 조회 */
  @Get()
  async getCategories(): Promise<AdminGoodsCategoryRes> {
    return this.categoryService.getCategories();
  }

  /** 상품 카테고리 생성 */
  @Post()
  async createCategory(
    @Body(ValidationPipe) dto: CreateGoodsCategoryDto,
  ): Promise<GoodsCategory> {
    return this.categoryService.createCategory(dto);
  }

  /** 특정 상품 카테고리 정보 수정 */
  @Patch(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateGoodsCategoryDto,
  ): Promise<boolean> {
    return this.categoryService.updateCategory(id, dto);
  }

  /** 특정 상품 카테고리 삭제 */
  @Delete(':id')
  async deletePolicy(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.categoryService.deleteCategory(id);
  }
}
