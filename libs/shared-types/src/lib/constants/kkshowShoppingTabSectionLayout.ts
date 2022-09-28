export const LAYOUT_CAROUSEL = 'carousel';
export const LAYOUT_AUTO_SLIDE = 'square--auto-slide';
export const LAYOUT_SMALL_SQUARE_LIST = 'small-square--row';
export const LAYOUT_BIG_SQUARE_LIST = 'big-square--row';
export const LAYOUT_RECT_GRID = 'rect--grid';
export const LAYOUT_RATING_DETAIL = 'rating-detail--row';
export const LAYOUT_BANNER = 'banner';

// 크크쇼 쇼핑탭 섹션에 적용될 레이아웃 이름들
export const layoutNames = [
  LAYOUT_CAROUSEL,
  LAYOUT_AUTO_SLIDE,
  LAYOUT_SMALL_SQUARE_LIST,
  LAYOUT_BIG_SQUARE_LIST,
  LAYOUT_RECT_GRID,
  LAYOUT_RATING_DETAIL,
  LAYOUT_BANNER,
];

// 크크쇼 쇼핑탭 섹션에 적용될 레이아웃별 이름과 설명
export const layoutDesc = {
  [LAYOUT_CAROUSEL]: {
    name: '캐러셀',
    desc: '최상단 캐러셀',
    buttonLabel: '캐러셀 이미지 추가',
  },
  [LAYOUT_AUTO_SLIDE]: {
    name: '카드 자동 슬라이드',
    desc: '카드 자동슬라이드',
    buttonLabel: '상품 추가',
  },
  [LAYOUT_SMALL_SQUARE_LIST]: {
    name: '작은 카드 일렬',
    desc: '모바일 3개, 데스크탑 5개 상품 표시. 작은 카드 일렬 배열(가로 스크롤 안됨)',
    buttonLabel: '상품 추가(최대 5개까지만 보여짐)',
  },
  [LAYOUT_BIG_SQUARE_LIST]: {
    name: '큰 카드 일렬',
    desc: '3개의 상품 표시. 큰 카드 일렬 배열(모바일에서만 가로 스크롤 됨)',
    buttonLabel: '상품 추가(최대 3개까지만 보여짐)',
  },
  [LAYOUT_RECT_GRID]: {
    name: '직사각형 격자',
    desc: '모바일 4개, 데스크탑 5개의 상품 표시. 직사각형 카드 격자 배열',
    buttonLabel: '상품 추가(최대 5개까지만 보여짐)',
  },
  [LAYOUT_RATING_DETAIL]: {
    name: '별점 상세데이터 일렬',
    desc: '모바일 4개, 데스크탑 5개 데이터 표시. 이미지, 별점, 설명 있는 카드 일렬 배열(리뷰데이터)',
    buttonLabel: '데이터 추가(최대 4개까지만 보여짐)',
  },
  [LAYOUT_BANNER]: { name: '배너', desc: '가로로 긴 배너형태' },
};
