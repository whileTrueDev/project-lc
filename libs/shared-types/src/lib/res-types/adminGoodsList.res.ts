import { Goods, Seller } from '@prisma/client';

export type GoodsDataForProductPromotion = Pick<Goods, 'id' | 'goods_name'> & {
  seller: Pick<Seller, 'id' | 'email'>;
};

export type AdminAllLcGoodsList = GoodsDataForProductPromotion[];
