import {
  GoodsConfirmationStatuses,
  GoodsStatus,
  GoodsView,
  RunoutPolicy,
} from '@prisma/client';

// 재고에 따른 판매 설정
export const RUNOUT_POLICY: Record<RunoutPolicy, string> = {
  stock: '재고',
  ableStock: '가용 재고',
  unlimited: '무제한',
};
// 상품 판매 상태
export const GOODS_STATUS: Record<GoodsStatus, string> = {
  normal: '정상',
  runout: '품절',
  purchasing: '재고확보중',
  unsold: '판매중지',
};
// 상품 판매 상태 컬러
export const GOODS_STATUS_COLOR: Record<GoodsStatus, string> = {
  normal: 'green',
  runout: 'red',
  purchasing: 'orange',
  unsold: 'gray',
};
// 상품 노출 여부
export const GOODS_VIEW: Record<GoodsView, string> = {
  look: '노출',
  notLook: '미노출',
};
// 상품 검수 상태 정보
export const GOODS_CONFIRMATION_STATUS: Record<
  GoodsConfirmationStatuses,
  { label: string; colorScheme?: string }
> = {
  waiting: { label: '대기', colorScheme: 'gray' },
  confirmed: { label: '승인', colorScheme: 'green' },
  rejected: { label: '거절', colorScheme: 'red' },
  needReconfirmation: { label: '재검수 대기' },
};
