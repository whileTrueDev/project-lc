import { SellType } from '@prisma/client';

export const convertSellTypeToString = (
  sellType?: SellType | 'normal' | null,
): string => {
  if (sellType === 'liveShopping') return '라이브쇼핑';
  if (sellType === 'broadcasterPromotionPage') return '상품홍보';
  return '기본판매';
};
