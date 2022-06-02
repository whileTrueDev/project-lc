import { SellerShop } from '@prisma/client';
import { useCartStore } from '@project-lc/stores';
import {
  calculateShippingCostInCartTable,
  ShippingGroupData,
} from '@project-lc/utils-frontend';
import { useMemo } from 'react';
import { useCart } from '../queries/useCart';

export function useCartShippingGroups(): {
  cartItemsObjectGroupedById: Record<number, number[]>; // { [배송비그룹id] : 장바구니상품id[], ... }
  totalShippingCostObjectById: Record<number, number | null>; // { [배송비그룹id] : 부과되는 배송비, ... }
  shippingGroupIdList: number[];
  shippingGroupWithShopNameObject: Record<
    number,
    ShippingGroupData & { shopName: SellerShop['shopName'] }
  >;
} {
  const { data } = useCart();
  const selectedItems = useCartStore((s) => s.selectedItems);

  // 배송그룹 목록 배송그룹id []
  const shippingGroupIdList = useMemo(() => {
    if (!data) return [];
    const idList = data
      .map((cartItem) => cartItem.shippingGroupId)
      .filter((id): id is number => id !== null);
    return Array.from(new Set<number>(idList));
  }, [data]);

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

  // 배송그룹 정보 & 상점정보
  const shippingGroupWithShopNameObject = useMemo(() => {
    const result: Record<
      number,
      ShippingGroupData & { shopName: SellerShop['shopName'] }
    > = {};
    if (!data) return result;

    return data.reduce((obj, cartItem) => {
      if (!cartItem.shippingGroupId || obj[cartItem.shippingGroupId]) return obj;

      return {
        ...obj,
        [cartItem.shippingGroupId]: {
          ...cartItem.shippingGroup,
          shopName: cartItem.goods.seller.sellerShop?.shopName,
        },
      };
    }, result);
  }, [data]);

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
    shippingGroupWithShopNameObject,
  };
}

export default useCartShippingGroups;
