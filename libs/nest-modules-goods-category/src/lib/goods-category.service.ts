import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { Cache } from 'cache-manager';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateGoodsCategoryDto,
  GoodsCategoryRes,
  UpdateGoodsCategoryDto,
} from '@project-lc/shared-types';
import { GoodsCategory } from '@prisma/client';

@Injectable()
export class GoodsCategoryService extends ServiceBaseWithCache {
  #GOODS_CATEGORY_CACHE_KEY = 'goods-category';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  // 카테고리 생성
  async createCategory(createDto: CreateGoodsCategoryDto): Promise<GoodsCategory> {
    const newCategory = await this.prisma.goodsCategory.create({
      data: {
        ...createDto,
      },
    });

    await this._clearCaches(this.#GOODS_CATEGORY_CACHE_KEY);

    return newCategory;
  }

  // 카테고리 조회 -> 여기서 nested 형태로 조합해서 전달??
  // TODO: 리턴타입 지정
  async getCategories(): Promise<GoodsCategoryRes> {
    const goodsCategorySelectOptions = {
      _count: { select: { goods: true } },
      id: true,
      categoryCode: true,
      name: true,
      mainCategoryFlag: true,
      parentCategoryId: true,
      parentCategory: true,
    };
    const mainCategories = await this.prisma.goodsCategory.findMany({
      where: { mainCategoryFlag: true },
      select: {
        ...goodsCategorySelectOptions,
        // 메인 > 1차카테고리 포함
        childrenCategories: {
          select: {
            ...goodsCategorySelectOptions,
            // 1차 > 2차 카테고리 포함
            childrenCategories: {
              select: {
                ...goodsCategorySelectOptions,
              },
            },
          },
        },
      },
    });
    return mainCategories;
  }

  // 카테고리 수정
  async updateCategory(id: number, updateDto: UpdateGoodsCategoryDto): Promise<boolean> {
    await this.prisma.goodsCategory.update({
      where: { id },
      data: { ...updateDto },
    });

    await this._clearCaches(this.#GOODS_CATEGORY_CACHE_KEY);

    return true;
  }

  // 카테고리 삭제
  async deleteCategory(id: number): Promise<boolean> {
    await this.prisma.goodsCategory.delete({
      where: { id },
    });

    await this._clearCaches(this.#GOODS_CATEGORY_CACHE_KEY);

    return true;
  }
}
