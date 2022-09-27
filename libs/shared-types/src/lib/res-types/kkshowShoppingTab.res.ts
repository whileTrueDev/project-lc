import { KkshowShoppingSectionItem } from '@prisma/client';

export interface ImageCard {
  imageUrl: string; // 이미지 url
  linkUrl: string; // 이미지 클릭시 이동할 주소 url (optional)
}

// 캐러셀 아이템 타입
export interface KkshowShoppingTabCarouselItem extends ImageCard {
  description?: string; // 이미지 설명 (optional)
}

// 상품 정보 타입
export interface KkshowShoppingTabGoodsData extends ImageCard {
  name: string; // 상품명
  normalPrice: number; // 정가
  discountedPrice?: number; // 할인가
}

// 후기 정보 타입
export interface KkshowShoppingTabReviewData extends ImageCard {
  title: string; // 후기 제목
  contents: string; // 후기 내용
  createDate: Date | string; // 후기 작성일
  rating: number; // 후기 별점
}

// 테마 키워드 타입
export type KkshowShopingTabTheme = string;
export type KkshowShoppingTabKeyword = {
  keyword: string; // 키워드
};
export interface KkshowShoppingTabThemeData {
  theme: KkshowShopingTabTheme; // 테마
  keywords: KkshowShoppingTabKeyword[]; // 키워드 목록
  imageUrl: string; // 테마 이미지 url
}

export interface KkshowShoppingTab extends ImageCard {
  message: string;
}

export interface KkshowShoppingTabBannerData {
  message?: string;
  link?: string;
  imageUrl?: string;
  fontColor?: string;
  backgroundColor?: string;
  backgroundRepeat?: string;
  backgroundPosition?: string;
  backgroundSize?: string;
}

// 크크쇼 쇼핑탭 데이터 리턴타입
export interface KkshowShoppingTabResData {
  // carousel ; 캐러셀
  carousel: KkshowShoppingTabCarouselItem[];
  // goodsOfTheWeek ; 금주의 상품
  goodsOfTheWeek: KkshowShoppingTabGoodsData[];
  // newLineUp ; 신상 라인업
  newLineUp: KkshowShoppingTabGoodsData[];
  // popularGoods ; 많이 찾는 상품
  popularGoods: KkshowShoppingTabGoodsData[];
  // recommendations; 크크마켓 추천상품
  recommendations: KkshowShoppingTabGoodsData[];
  // reviews; 생생후기
  reviews: KkshowShoppingTabReviewData[];
  // keywords; 테마별 키워드
  keywords: KkshowShoppingTabThemeData[];
  // banner: 이벤트 등 알림 배너
  banner: KkshowShoppingTab;
}

export default KkshowShoppingTabResData;

export interface KkshowShoppingTabResDataTemp {
  // carousel ; 캐러셀데이터
  carousel: KkshowShoppingSectionItem;
  sectionItems: KkshowShoppingSectionItem[];
}
