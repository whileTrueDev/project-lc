import { useCartStore } from '@project-lc/stores';
import { useMemo } from 'react';
import { useCart } from '../queries/useCart';

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
  const calculated = useMemo(() => {
    if (!data) return defaultCartCalculatedMetrics;
    return data
      .filter((cartItem) => selectedItems.includes(cartItem.id))
      .reduce((prev, item) => {
        const itemprice = item.options.reduce(
          (p, n) => p + Number(n.normalPrice) * n.quantity,
          0,
        );
        const orderPrice = item.options.reduce(
          (p, n) => p + Number(n.discountPrice) * n.quantity,
          0,
        );
        return {
          totalGoodsPrice: prev.totalGoodsPrice + itemprice,
          totalShippingCost: prev.totalShippingCost + Number(item.shippingCost),
          totalOrderPrice: prev.totalOrderPrice + orderPrice,
          totalDiscountAmount: prev.totalDiscountAmount + (itemprice - orderPrice),
        };
      }, defaultCartCalculatedMetrics);
  }, [data, selectedItems]);

  return calculated;
}
