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
  GoodsCategoryRes,
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

  @Get()
  async getCategories(): Promise<GoodsCategoryRes> {
    return this.categoryService.getCategories();
  }

  @Post()
  async createCategory(
    @Body(ValidationPipe) dto: CreateGoodsCategoryDto,
  ): Promise<GoodsCategory> {
    return this.categoryService.createCategory(dto);
  }

  @Patch(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateGoodsCategoryDto,
  ): Promise<boolean> {
    return this.categoryService.updateCategory(id, dto);
  }

  @Delete(':id')
  async deletePolicy(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.categoryService.deleteCategory(id);
  }
}
