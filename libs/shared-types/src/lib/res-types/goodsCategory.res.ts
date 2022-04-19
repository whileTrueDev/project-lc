import { GoodsCategory } from '@prisma/client';

export type CategoryWithGoodsCount = GoodsCategory & { goodsCount: number };

export type GoodsCategoryRes = CategoryWithGoodsCount[];
