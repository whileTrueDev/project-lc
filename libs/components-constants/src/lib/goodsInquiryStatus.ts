import { GoodsInquiryStatus } from '@prisma/client';

/** 상품 문의 상태 */
export const GOODS_INQUIRY_STATUS: Record<
  GoodsInquiryStatus,
  { label: string; colorScheme: string }
> = {
  answered: { label: '답변 완료', colorScheme: 'green' },
  adminAnswered: { label: '크크쇼관리자 답변 완료', colorScheme: 'orange' },
  requested: { label: '답변 필요', colorScheme: 'gray' },
};
