import { SellType } from '@prisma/client';

export const convertSellTypeToString = (sellType?: SellType | null): string => {
  if (sellType === 'liveShopping') return '라이브쇼핑';
  if (sellType === 'productPromotion') return '상품홍보';
  if (sellType === 'normal') return '기본판매';
  return '기본판매';
};
