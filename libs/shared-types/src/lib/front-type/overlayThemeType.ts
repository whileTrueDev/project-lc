export interface OverlayThemeDataType {
  backgroundImage?: string; // 전체 배경 이미지(우상단 크크쇼 로고 포함)
  backgroundColor?: string; // 랭킹, 타이머 영역 배경색
  color?: string; // 랭킹, 타이머 영역 글자색
  titleColor?: string; // top 구매자 글자색
  textShadow?: string; // top 구매자 글자 텍스트섀도우(TOP랭킹 글자에 적용되는 테두리 효과)
  podiumImage?: string; // 랭킹 비어있을 때 표시되는 단상아이콘 이미지
  timerImage?: string; // 타이머 영역 아이콘이미지
}

export type OverlayThemeFormData = {
  name: string;
  category?: string;
  style: OverlayThemeDataType;
  imageFile: Record<keyof OverlayThemeDataType, File | undefined>;
};
