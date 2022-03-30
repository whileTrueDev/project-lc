import {
  GoodsConfirmation,
  GoodsImages,
  Broadcaster,
  LiveShoppingVideo,
  BroadcasterChannel,
  Goods,
} from '@prisma/client';

export type SearchBroadcasterType = Pick<Broadcaster, 'userNickname' | 'avatar'>;

export type OptionalBroadcasterChannelType = Partial<BroadcasterChannel>;

export type SearchLiveShoppingVideoType = Pick<LiveShoppingVideo, 'youtubeUrl'>;

export type SearchConfirmationType = Pick<
  GoodsConfirmation,
  'firstmallGoodsConnectionId'
>;

export type SearchGoodsImageType = Pick<GoodsImages, 'image'>;

export interface BroadcasterWithChannel extends SearchBroadcasterType {
  channels: OptionalBroadcasterChannelType[];
}

export interface ProductSearchLiveShopping {
  broadcaster: BroadcasterWithChannel;
  liveShoppingVideo: SearchLiveShoppingVideoType;
}

export interface ProductSearch {
  id: number;
  goods_name: string;
  confirmation: SearchConfirmationType;
  image: SearchGoodsImageType[];
  LiveShopping: ProductSearchLiveShopping[];
}

export type SearchGoods = Pick<Goods, 'id' | 'goods_name'>;

export interface GoodsWithConfirmationAndImages extends SearchGoods {
  confirmation: SearchConfirmationType;
  image: SearchGoodsImageType[];
}

export interface BroadcasterSearch {
  broadcaster: BroadcasterWithChannel;
  goods: GoodsWithConfirmationAndImages;
  liveShoppingVideo: SearchLiveShoppingVideoType;
}
