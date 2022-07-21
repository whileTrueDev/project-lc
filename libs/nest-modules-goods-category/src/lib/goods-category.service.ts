import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GoodsCategory } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateGoodsCategoryDto,
  AdminGoodsCategoryRes,
  UpdateGoodsCategoryDto,
  GoodsCategoryRes,
  CategoryOnGoodsConnectionDto,
} from '@project-lc/shared-types';
import { nanoid } from 'nanoid';

@Injectable()
export class GoodsCategoryService {
  constructor(private readonly prisma: PrismaService) {}

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

      return newCategory;
    } catch (e) {
      if (e.code && e.code === 'P2002') {
        throw new BadRequestException('중복된 카테고리 코드 입력');
      }
      throw new InternalServerErrorException(e);
    }
  }

  // 카테고리 조회
  async getCategories(): Promise<AdminGoodsCategoryRes> {
    const categories = await this.prisma.goodsCategory.findMany({
      include: { _count: { select: { goods: true } } },
    });

    return categories.map((c) => {
      const { _count, ...category } = c;
      return { ...category, goodsCount: _count.goods };
    });
  }

  /** 특정 카테고리의 하위 카테고리 목록 조회 */
  async findChildCategories(
    parentCategoryId: GoodsCategory['parentCategoryId'],
  ): Promise<GoodsCategoryRes> {
    return this.prisma.goodsCategory.findMany({
      where: { parentCategoryId },
      include: { _count: { select: { childrenCategories: true } } },
    });
  }

  /** 최상위 카테고리 목록 조회 */
  async findMainCategories(): Promise<GoodsCategoryRes> {
    return this.prisma.goodsCategory.findMany({
      where: { mainCategoryFlag: true },
      include: { _count: { select: { childrenCategories: true } } },
    });
  }

  // 카테고리 수정
  async updateCategory(id: number, updateDto: UpdateGoodsCategoryDto): Promise<boolean> {
    await this.prisma.goodsCategory.update({
      where: { id },
      data: { ...updateDto },
    });

    return true;
  }

  // 카테고리 삭제
  async deleteCategory(id: number): Promise<boolean> {
    await this.prisma.goodsCategory.delete({
      where: { id },
    });

    return true;
  }

  /**
   * 특정 상품과 카테고리 연결 생성
   */
  async connectCategoryOnGoods(dto: CategoryOnGoodsConnectionDto): Promise<boolean> {
    const { goodsId, categoryId } = dto;
    await this.prisma.goodsCategory.update({
      where: { id: categoryId },
      data: { goods: { connect: { id: goodsId } } },
    });
    return true;
  }

  /**
   * 특정 상품과 카테고리 연결 해제
   */
  async disconnectCategoryOnGoods(dto: CategoryOnGoodsConnectionDto): Promise<boolean> {
    const { goodsId, categoryId } = dto;
    await this.prisma.goodsCategory.update({
      where: { id: categoryId },
      data: { goods: { disconnect: { id: goodsId } } },
    });
    return true;
  }
}
