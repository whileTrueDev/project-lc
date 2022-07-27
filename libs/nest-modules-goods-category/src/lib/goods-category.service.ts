import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GoodsCategory, Prisma } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateGoodsCategoryDto,
  AdminGoodsCategoryRes,
  UpdateGoodsCategoryDto,
  GoodsCategoryRes,
  CategoryOnGoodsConnectionDto,
  GoodsCategoryWithFamily,
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
        throw new BadRequestException('중복된 카테고리');
      }
      throw new InternalServerErrorException(e);
    }
  }

  // 카테고리 조회
  async getCategories(): Promise<AdminGoodsCategoryRes> {
    const categories = await this.prisma.goodsCategory.findMany({
      include: { _count: { select: { goods: true } }, kkshowShoppingTabCategory: true },
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

  /** 특정 카테고리 조회 */
  async findCategory(id: number): Promise<GoodsCategoryWithFamily>;
  async findCategory(categoryCode: string): Promise<GoodsCategoryWithFamily>;
  async findCategory(findTarget: number | string): Promise<GoodsCategoryWithFamily> {
    const includeField: Prisma.GoodsCategoryInclude = {
      // 하위 -> 하위 카테고리까지
      childrenCategories: { include: { childrenCategories: true } },
      // 상위 -> 상위 카테고리까지
      parentCategory: { include: { parentCategory: true } },
    };
    if (typeof findTarget === 'number') {
      return this.prisma.goodsCategory.findUnique({
        where: { id: findTarget },
        include: includeField,
      });
    }
    return this.prisma.goodsCategory.findUnique({
      where: { categoryCode: findTarget },
      include: includeField,
    });
  }

  /** 상위 카테고리정보를 포함하는 특정 카테고리 목록 조회. */
  async findCategoriesByCodes(
    categoryCodes: string[],
    opts?: { withChildren?: boolean },
  ): Promise<GoodsCategoryWithFamily[]> {
    const result = await this.prisma.goodsCategory.findMany({
      where: { categoryCode: { in: categoryCodes } },
      include: !opts?.withChildren
        ? { parentCategory: { include: { parentCategory: true } } }
        : {
            // 하위 -> 하위 카테고리까지
            childrenCategories: { include: { childrenCategories: opts?.withChildren } },
            // 상위 -> 상위 카테고리까지
            parentCategory: { include: { parentCategory: true } },
          },
    });

    // 하위 카테고리가 이미지가 없는 경우 상위카테고리의 이미지로 채워넣는 작업
    const imageFilledResult = result.map((r) => {
      const tmp = { ...r };
      if (tmp.imageSrc) return tmp;
      if (r.parentCategory) {
        if (r.parentCategory.imageSrc) tmp.imageSrc = r.parentCategory?.imageSrc;
        if (
          !r.parentCategory.imageSrc &&
          r.parentCategory.parentCategory &&
          r.parentCategory.parentCategory.imageSrc
        ) {
          tmp.imageSrc = r.parentCategory.parentCategory.imageSrc;
        }
      }
      return tmp;
    });
    return imageFilledResult;
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
