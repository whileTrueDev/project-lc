import {
  Broadcaster,
  BroadcasterChannel,
  BroadcasterPromotionPage,
  Goods,
  GoodsImages,
  GoodsOptions,
  LiveShopping,
  LiveShoppingImage,
  SellerShop,
} from '@prisma/client';

export interface LiveShoppingWithGoods extends LiveShopping {
  goods: {
    goods_name: string;
    summary: string;
    image: GoodsImages[];
    options: GoodsOptions[];
  };
  seller: {
    sellerShop: SellerShop;
  };
  broadcaster: Pick<
    Broadcaster,
    'id' | 'userName' | 'userNickname' | 'email' | 'avatar'
  > & {
    channels: BroadcasterChannel[];
    BroadcasterPromotionPage: BroadcasterPromotionPage | null;
  };
  liveShoppingVideo: { youtubeUrl: string };
  images: LiveShoppingImage[];
}

export type LiveShoppingOutline = Pick<
  LiveShopping,
  | 'id'
  | 'goodsId'
  | 'sellStartDate'
  | 'sellEndDate'
  | 'broadcastStartDate'
  | 'broadcastEndDate'
  | 'progress'
  | 'liveShoppingName'
> & {
  images: LiveShoppingImage[];
} & {
  goods: Pick<Goods, 'id' | 'goods_name' | 'summary'> & {
    image: GoodsImages[];
    options: GoodsOptions[];
  };
};
