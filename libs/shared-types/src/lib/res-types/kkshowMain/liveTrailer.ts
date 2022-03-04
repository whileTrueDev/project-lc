// 크크쇼 메인 라이브예고 데이터
export interface KkShowMainLiveTrailer {
  imageUrl: string; // 홍보용이미지 url
  productLinkUrl: string; // 판매상품링크 url
  broadcasterProfileImageUrl: string;
  broadcasterNickname: string; // 방송인 활동명
  broadcasterDescription: string; // 방송인 설명(해시태그)
  liveShoppingName: string; // 라이브쇼핑명
  broadcastStartDate: Date; // 방송시작일시
  normalPrice: number; // 원래 판매가격
  discountedPrice: number; // 할인된 판매가격
}
