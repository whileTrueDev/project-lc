import { GoodsCategory } from '@prisma/client';

export type CategoryWithGoodsCount = GoodsCategory & { goodsCount: number };
export type AdminGoodsCategoryRes = CategoryWithGoodsCount[];

export type GoodsCategoryItem = GoodsCategory & {
  _count: {
    childrenCategories: number;
  };
};
/** 상품카테고리 조회 반환 타입 */
export type GoodsCategoryRes = GoodsCategoryItem[];

export interface GoodsCategoryWithParent extends GoodsCategory {
  parentCategory?: GoodsCategoryWithParent;
}
export interface GoodsCategoryWithChildren extends GoodsCategory {
  childrenCategories?: GoodsCategoryWithChildren[];
}
export interface GoodsCategoryWithFamily extends GoodsCategory {
  childrenCategories?: GoodsCategoryWithChildren[];
  parentCategory?: GoodsCategoryWithParent;
}
