import { LiveShopppingProgressType } from '@prisma/client';

// 크크쇼 메인 캐러셀 아이템 타입
export type KkshowMainCarouselItem =
  | SimpleBannerItem
  | UpcomingLiveItem
  | NowPlayingLiveItem
  | PreviousLiveItem;

// 단순배너 아이템 : 이미지 url + 이미지에 연결된 링크
export interface SimpleBannerItem extends KkshowMainCarouselItemBase, Image {
  type: 'simpleBanner';
  linkUrl?: string;
  description?: string;
}

// 라이브예고 아이템 : 이미지url + 상품정보(상품링크) + 방송인정보
export interface UpcomingLiveItem
  extends KkshowMainCarouselItemBase,
    LiveShoppingInfo,
    Image,
    ProductAndBroadcasterInfo {
  type: 'upcoming';
}

// 현재라이브 아이템: 플랫폼 + 영상url + 상품정보(상품링크) + 방송인정보
export interface NowPlayingLiveItem
  extends KkshowMainCarouselItemBase,
    LiveShoppingInfo,
    Video,
    ProductAndBroadcasterInfo {
  type: 'nowPlaying';
  platform: LivePlatform;
}

// 이전라이브 아이템: 영상url + 상품정보(상품링크) + 방송인정보
export interface PreviousLiveItem
  extends KkshowMainCarouselItemBase,
    LiveShoppingInfo,
    Video,
    ProductAndBroadcasterInfo {
  type: 'previous';
}

export type KkshowMainCarouselItemType =
  | 'simpleBanner'
  | 'upcoming'
  | 'nowPlaying'
  | 'previous';

export type LivePlatform = 'twitch' | 'youtube';

interface KkshowMainCarouselItemBase {
  type: KkshowMainCarouselItemType;
}

export interface ProductAndBroadcasterInfo
  extends ProductInfo,
    BroadcasterInfo,
    LiveShoppingInfo {}
interface ProductInfo {
  liveShoppingName: string;
  productImageUrl: string;
  normalPrice: number;
  discountedPrice: number;
  productLinkUrl: string;
}

interface BroadcasterInfo {
  profileImageUrl: string;
  broadcasterNickname: string;
  promotionPageLinkUrl: string;
}

interface LiveShoppingInfo {
  liveShoppingId: number | null;
  liveShoppingProgress: LiveShopppingProgressType | null;
  broadcastStartDate: Date | null;
  broadcastEndDate: Date | null;
}

interface Video {
  videoUrl: string;
}

interface Image {
  imageUrl: string;
}
