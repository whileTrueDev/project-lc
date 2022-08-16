import { getLiveShoppingIsNowLive } from '@project-lc/shared-types';
import { useCartStore } from '@project-lc/stores';
import { useMemo } from 'react';
import { useCart } from '../queries/useCart';
import useCartShippingGroups from './useCartShippingCostByShippingGroup';

interface CartCalculatedMetrics {
  totalGoodsPrice: number;
  totalDiscountAmount: number;
  totalShippingCost: number;
  totalOrderPrice: number;
}
const defaultCartCalculatedMetrics: CartCalculatedMetrics = {
  totalGoodsPrice: 0,
  totalDiscountAmount: 0,
  totalShippingCost: 0,
  totalOrderPrice: 0,
};
/** 장바구니 합계 정보를 구하는 훅 */
export function useCartCalculatedMetrics(): CartCalculatedMetrics {
  const { data } = useCart();
  const selectedItems = useCartStore((s) => s.selectedItems);

  const { totalShippingCostObjectById } = useCartShippingGroups();
  const totalShippingCost = Object.values(totalShippingCostObjectById).reduce(
    (sum, costObj) => {
      if (costObj) {
        return sum + costObj.std + costObj.add;
      }
      return sum;
    },
    0,
  );

  const calculated = useMemo(() => {
    if (!data) return defaultCartCalculatedMetrics;
    return data
      .filter((cartItem) => selectedItems.includes(cartItem.id))
      .reduce((prev, item) => {
        // 장바구니 상품에 연결된 진행중인 라이브쇼핑 있는지 확인
        const isCartItemSupportIsNowLive =
          item.support && item.support.liveShoppingId
            ? getLiveShoppingIsNowLive(item.support.liveShopping)
            : false;

        const itemprice = item.options.reduce(
          (p, n) => p + Number(n.normalPrice) * n.quantity,
          0,
        );
        const orderPrice = item.options.reduce((p, n) => {
          let price = Number(n.discountPrice);
          if (
            isCartItemSupportIsNowLive &&
            item.support &&
            item.support.liveShopping?.liveShoppingSpecialPrices.length
          ) {
            const spData = item.support.liveShopping?.liveShoppingSpecialPrices.find(
              (sp) => sp.goodsOptionId === n.goodsOptionsId,
            );
            price = Number(spData?.specialPrice);
          }
          return p + price * n.quantity;
        }, 0);
        return {
          totalGoodsPrice: prev.totalGoodsPrice + itemprice,
          totalShippingCost,
          totalOrderPrice: prev.totalOrderPrice + orderPrice,
          totalDiscountAmount: prev.totalDiscountAmount + (itemprice - orderPrice),
        };
      }, defaultCartCalculatedMetrics);
  }, [data, selectedItems, totalShippingCost]);

  return calculated;
}
