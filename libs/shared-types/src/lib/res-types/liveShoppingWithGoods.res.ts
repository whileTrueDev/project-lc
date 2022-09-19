import {
  Broadcaster,
  BroadcasterChannel,
  BroadcasterPromotionPage,
  BroadcasterSettlementItems,
  Goods,
  GoodsConfirmation,
  GoodsImages,
  GoodsOptions,
  LiveShopping,
  LiveShoppingExternalGoods,
  LiveShoppingImage,
  LiveShoppingMessageSetting,
  LiveShoppingSpecialPrice,
  OrderItemOption,
  SellerShop,
} from '@prisma/client';

export interface LiveShoppingKkshowGoodsData {
  goods_name: string;
  summary: string;
  image: GoodsImages[];
  options: GoodsOptions[];
  confirmation?: Pick<GoodsConfirmation, 'status'>;
}

export interface LiveShoppingWithGoods extends LiveShopping {
  messageSetting?: LiveShoppingMessageSetting;
  goods: LiveShoppingKkshowGoodsData | null;
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
  externalGoods?: null | LiveShoppingExternalGoods;
  BroadcasterSettlementItems?: BroadcasterSettlementItems[];
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
