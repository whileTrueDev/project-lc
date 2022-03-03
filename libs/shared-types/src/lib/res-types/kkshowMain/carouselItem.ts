// 크크쇼 메인 캐러셀 아이템 타입
export type KkshowMainCarouselItem =
  | SimpleBannerItem
  | UpComingLiveItem
  | NowPlayingLiveItem
  | PreviousLiveItem;

// 단순배너 아이템 : 이미지 url + 이미지에 연결된 링크
export interface SimpleBannerItem extends KkshowMainCarouselItemBase, Image {
  type: 'simpleBanner';
  linkUrl?: string;
}

// 라이브예고 아이템 : 이미지url + 상품정보(상품링크) + 방송인정보
export interface UpComingLiveItem
  extends KkshowMainCarouselItemBase,
    Image,
    Partial<ProductInfo>,
    BroadcasterInfo {
  type: 'upcoming';
}

// 현재라이브 아이템: 플랫폼 + 영상url + 상품정보(상품링크) + 방송인정보
export interface NowPlayingLiveItem
  extends KkshowMainCarouselItemBase,
    Video,
    ProductInfo,
    BroadcasterInfo {
  type: 'nowPlaying';
  platform: LivePlatform;
}

// 이전라이브 아이템: 영상url + 상품정보(상품링크) + 방송인정보
export interface PreviousLiveItem
  extends KkshowMainCarouselItemBase,
    Video,
    Partial<ProductInfo>,
    BroadcasterInfo {
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

interface ProductInfo {
  productName: string;
  productImageUrl: string;
  normalPrice: number;
  discountedPrice: number;
  productLinkUrl: string;
}

interface Video {
  videoUrl: string;
}

interface Image {
  imageUrl: string;
}

interface BroadcasterInfo {
  profileImageUrl: string;
  broadcasterNickname: string;
  promotionPageLinkUrl: string;
}
