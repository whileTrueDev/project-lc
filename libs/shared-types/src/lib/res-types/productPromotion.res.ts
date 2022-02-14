import { Goods, ProductPromotion, Seller, SellerShop } from '@prisma/client';

export type ProductPromotionListItemData = ProductPromotion & {
  goods: Pick<Goods, 'goods_name'> & {
    seller: Pick<Seller, 'name'> & {
      sellerShop: Pick<SellerShop, 'shopName'>;
    };
  };
};
export type ProductPromotionListData = ProductPromotionListItemData[];
