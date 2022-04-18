import { GoodsCategory } from '@prisma/client';

export type CategoryWithChildrenCategoriesAndGoodsCount = GoodsCategory & {
  _count: {
    goods: number;
  };
  childrenCategories: CategoryWithChildrenCategoriesAndGoodsCount[];
  parentCategory: GoodsCategory;
};

export type GoodsCategoryRes = CategoryWithChildrenCategoriesAndGoodsCount[];
