import { Goods, ProductPromotion } from '@prisma/client';

export type ProductPromotionListData = (ProductPromotion & {
  goods: Pick<Goods, 'goods_name'>;
})[];
