import { Broadcaster, LiveShopping } from '@prisma/client';

// TODO: 변경될 수 있음. Joni 작업 이후 완성된 타입을 사용해야 함.
export interface KkshowMainRes {
  carousel: KkshowMainCarousel[];
  trailer: {
    imageUrl: string;
    normalPrice: number;
    liveShoppingId: LiveShopping['id'];
    productLinkUrl: string;
    discountedPrice: number;
    liveShoppingName: string;
    broadcastStartDate: Date;
    broadcasterNickname: string;
    broadcasterDescription: string;
    broadcasterProfileImageUrl: string;
  };
  bestLive: {
    videoUrl: string;
    liveShoppingId: LiveShopping['id'];
    liveShoppingTitle: string;
    liveShoppingDescription: string;
    broadcasterProfileImageUrl: string;
  }[];
  bestBroadcaster: {
    nickname: string;
    broadcasterId: Broadcaster['id'];
    profileImageUrl: string;
    productPromotionUrl: string;
  }[];
}

export type KkshowMainCarousel =
  | {
      type: 'simpleBanner';
      linkUrl: string;
      imageUrl: string;
      description: string;
    }
  | {
      type: 'upcoming';
      imageUrl: string;
      videoUrl: string;
      normalPrice: number;
      liveShoppingId: LiveShopping['id'];
      productLinkUrl: string;
      discountedPrice: number;
      productImageUrl: string;
      profileImageUrl: string;
      liveShoppingName: string;
      broadcasterNickname: string;
      promotionPageLinkUrl: string;
    }
  | {
      type: 'nowPlaying';
      imageUrl: string;
      platform: string;
      videoUrl: string;
      normalPrice: number;
      liveShoppingId: number;
      productLinkUrl: string;
      discountedPrice: number;
      productImageUrl: string;
      profileImageUrl: string;
      liveShoppingName: string;
      broadcasterNickname: string;
      promotionPageLinkUrl: string;
    }
  | {
      type: 'previous';
      imageUrl: string;
      videoUrl: string;
      normalPrice: number;
      liveShoppingId: number;
      productLinkUrl: string;
      discountedPrice: number;
      productImageUrl: string;
      profileImageUrl: string;
      liveShoppingName: string;
      broadcasterNickname: string;
      promotionPageLinkUrl: string;
    };
