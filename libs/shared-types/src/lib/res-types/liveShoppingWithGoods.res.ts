import {
  Broadcaster,
  BroadcasterChannel,
  BroadcasterPromotionPage,
  Goods,
  GoodsConfirmation,
  GoodsImages,
  GoodsOptions,
  LiveShopping,
  LiveShoppingImage,
  LiveShoppingMessageSetting,
  LiveShoppingSpecialPrice,
  OrderItemOption,
  SellerShop,
} from '@prisma/client';

export interface LiveShoppingWithGoods extends LiveShopping {
  messageSetting?: LiveShoppingMessageSetting;
  goods: {
    goods_name: string;
    summary: string;
    image: GoodsImages[];
    options: GoodsOptions[];
    confirmation?: Pick<GoodsConfirmation, 'status'>;
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
  orderItemSupport: {
    orderItem: {
      options: Pick<OrderItemOption, 'discountPrice' | 'quantity'>[];
    };
  }[];
  liveShoppingSpecialPrices?: LiveShoppingSpecialPrice[];
}

export type SpecialPriceItem = Pick<
  LiveShoppingSpecialPrice,
  'id' | 'specialPrice' | 'goodsId' | 'goodsOptionId'
>;

export type LiveShoppingOutline = Pick<
  LiveShopping,
  | 'id'
  | 'goodsId'
  | 'sellStartDate'
  | 'sellEndDate'
  | 'broadcastStartDate'
  | 'broadcastEndDate'
  | 'broadcasterId'
  | 'progress'
  | 'liveShoppingName'
> & {
  images: LiveShoppingImage[];
} & {
  goods: Pick<Goods, 'id' | 'goods_name' | 'summary'> & {
    image: GoodsImages[];
    options: GoodsOptions[];
  };
} & {
  liveShoppingSpecialPrices: SpecialPriceItem[];
};
