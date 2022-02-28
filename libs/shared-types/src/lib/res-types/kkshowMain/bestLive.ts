// 크크쇼 메인 베스트 라이브 섹션 아이템
export interface KkshowMainBestLiveItem {
  order: number; // 순위
  videoUrl: string; // 유튜브 임베드 위한 url
  broadcasterProfileImageUrl: string; // 방송인 프로필사진 url
  liveShoppingDescription: string; // 쵸단x귀빈정 <= 이부분에 표시될 문구
  liveShoppingTitle: string; // 해피쵸이어 <= 이부분에 표시될 문구
}
