import {
  Broadcaster,
  BroadcasterPromotionPage,
  Goods,
  GoodsImages,
  GoodsOptions,
  ProductPromotion,
} from '@prisma/client';

export type BroadcasterPromotionPageData = BroadcasterPromotionPage & {
  broadcaster: Pick<Broadcaster, 'userNickname' | 'email'>;
};
export type BroadcasterPromotionPageListRes = BroadcasterPromotionPageData[];

/** 방송인 홍보페이지 홍보 상품 */
export type PromotionPagePromotionGoods = {
  id: ProductPromotion['id'];
  goods: Pick<Goods, 'id' | 'goods_name' | 'summary'> & {
    options: Array<
      Pick<
        GoodsOptions,
        'id' | 'consumer_price' | 'price' | 'option1' | 'option_title' | 'default_option'
      >
    >;
  } & {
    image: Array<GoodsImages>;
  };
};

/** 방송인 홍보페이지 홍보 상품 목록 정보 */
export interface PromotionPagePromotionGoodsRes {
  productPromotions: Array<PromotionPagePromotionGoods>;
  nextCursor?: number;
}
