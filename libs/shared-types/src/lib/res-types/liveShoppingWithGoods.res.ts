import {
  Broadcaster,
  BroadcasterPromotionPage,
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
    BroadcasterPromotionPage: BroadcasterPromotionPage | null;
  };
  liveShoppingVideo: { youtubeUrl: string };
  images: LiveShoppingImage[];
}
