import {
  Inject,
  Injectable,
  CACHE_MANAGER,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { Cache } from 'cache-manager';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateGoodsCategoryDto,
  GoodsCategoryRes,
  UpdateGoodsCategoryDto,
} from '@project-lc/shared-types';
import { GoodsCategory } from '@prisma/client';
import { nanoid } from 'nanoid';

@Injectable()
export class GoodsCategoryService extends ServiceBaseWithCache {
  #GOODS_CATEGORY_CACHE_KEY = 'goods-category';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  private createCategoryCode(): string {
    return nanoid();
  }

  // 카테고리 생성
  async createCategory(createDto: CreateGoodsCategoryDto): Promise<GoodsCategory> {
    try {
      const { categoryCode } = createDto; // categoryCode느ㄴ 옵셔널임
      const newCategory = await this.prisma.goodsCategory.create({
        data: {
          categoryCode: categoryCode || this.createCategoryCode(),
          ...createDto,
        },
      });

      await this._clearCaches(this.#GOODS_CATEGORY_CACHE_KEY);

      return newCategory;
    } catch (e) {
      if (e.code && e.code === 'P2002') {
        throw new BadRequestException('중복된 카테고리 코드 입력');
      }
      throw new InternalServerErrorException(e);
    }
  }

  // 카테고리 조회
  async getCategories(): Promise<GoodsCategoryRes> {
    const categories = await this.prisma.goodsCategory.findMany({
      include: { _count: { select: { goods: true } } },
    });

    return categories.map((c) => {
      const { _count, ...category } = c;
      return { ...category, goodsCount: _count.goods };
    });
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
