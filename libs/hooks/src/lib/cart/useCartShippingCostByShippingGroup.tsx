import { useCartStore } from '@project-lc/stores';
import { calculateShippingCostInCartTable } from '@project-lc/utils-frontend';
import { useMemo } from 'react';
import { useCart } from '../queries/useCart';

export function useCartShippingCostByShippingGroup(): {
  cartItemsObjectGroupedById: Record<number, number[]>; // { [배송비그룹id] : 장바구니상품id[], ... }
  totalShippingCostObjectById: Record<number, number | null>; // { [배송비그룹id] : 부과되는 배송비, ... }
  shippingGroupIdList: number[];
} {
  const { data } = useCart();
  const selectedItems = useCartStore((s) => s.selectedItems);

  // 배송그룹별 카트아이템들 Record<배송그룹id, 카트상품id[]>
  const cartItemsObjectGroupedById: Record<number, number[]> = useMemo(() => {
    const result: Record<number, number[]> = {};
    if (!data) return result;
    return data.reduce((obj, cartItem) => {
      if (!cartItem.shippingGroupId) return obj;
      if (obj[cartItem.shippingGroupId]) {
        obj[cartItem.shippingGroupId].push(cartItem.id);
        return obj;
      }
      return { ...obj, [cartItem.shippingGroupId]: [cartItem.id] };
    }, result);
  }, [data]);

  // 배송그룹 목록 배송그룹id []
  const shippingGroupIdList = useMemo(
    () => Object.keys(cartItemsObjectGroupedById).map((key) => Number(key)),
    [cartItemsObjectGroupedById],
  );

  // 배송그룹별 선택된 카트아이템 Record<배송그룹id, 선택된 카트상품id[]>
  const groupedSelectedItems = useMemo(() => {
    const obj = { ...cartItemsObjectGroupedById };

    shippingGroupIdList.forEach((groupId) => {
      obj[groupId] = cartItemsObjectGroupedById[groupId].filter((itemId) =>
        selectedItems.includes(itemId),
      );
    });
    return obj;
  }, [cartItemsObjectGroupedById, selectedItems, shippingGroupIdList]);

  // 배송그룹별 표시될 배송비(selectedItems, 배송그룹정보) => 배송비 Record<배송그룹id, 배송비>
  const totalShippingCostObjectById: Record<number, number | null> = useMemo(() => {
    const result: Record<number, number | null> = {};
    if (!data) return result;
    shippingGroupIdList.forEach((id) => {
      const shippingGroup =
        data.find((cartItem) => cartItem.shippingGroupId === id)?.shippingGroup || null;
      const cartItems = data.filter((item) => groupedSelectedItems[id].includes(item.id));
      const withShippingCalculTypeFree = false; //  TODO: 다른 배송비그룹 정보 필요

      const shipcost = calculateShippingCostInCartTable({
        shippingGroup,
        cartItems,
        withShippingCalculTypeFree,
      });
      result[id] = shipcost;
    });
    return result;
  }, [data, groupedSelectedItems, shippingGroupIdList]);

  return {
    cartItemsObjectGroupedById,
    totalShippingCostObjectById,
    shippingGroupIdList,
  };
}

export default useCartShippingCostByShippingGroup;
