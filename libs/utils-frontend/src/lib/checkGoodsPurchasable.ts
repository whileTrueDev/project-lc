import { Goods } from '@prisma/client';

interface IGoodsCheck {
  goods_name: Goods['goods_name'];
  max_purchase_limit: Goods['max_purchase_limit'];
  min_purchase_limit: Goods['min_purchase_limit'];
  max_purchase_ea: Goods['max_purchase_ea'];
  min_purchase_ea: Goods['min_purchase_ea'];
}
/** 최소,최대 개수 제한에 대하여 상품 주문이 가능한지 체크 */
export const checkGoodsPurchasable = (
  goods: IGoodsCheck,
  quantity: number,
  callbacks: {
    onMinLimitFail: () => void;
    onMaxLimitFail: () => void;
  },
): boolean => {
  if (goods.max_purchase_limit === 'limit' || goods.min_purchase_limit === 'limit') {
    if (goods.max_purchase_ea && quantity > goods.max_purchase_ea) {
      callbacks.onMaxLimitFail();
      return false;
    }
    if (goods.min_purchase_ea && quantity < goods.min_purchase_ea) {
      callbacks.onMinLimitFail();
      return false;
    }
  }
  return true;
};

export default checkGoodsPurchasable;
