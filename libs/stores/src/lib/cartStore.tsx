import { CartItemRes } from '@project-lc/shared-types';
import create from 'zustand';

export interface ICartStore {
  /** 선택된 goodsId 배열 */
  selectedItems: number[];
  handleToggle: (s: CartItemRes[number]) => void;
  handleSelectAll: (allData: CartItemRes) => void;
  handleUnselectAll: () => void;
}

/** 크크쇼 장바구니 상태 관리 */
export const useCartStore = create<ICartStore>((set) => ({
  selectedItems: [],
  handleToggle: (s: CartItemRes[number]) => {
    set(({ selectedItems }) => {
      if (selectedItems.findIndex((goodsId) => goodsId === s.id) > -1) {
        return {
          selectedItems: selectedItems.filter((goodsId) => goodsId !== s.id),
        };
      }
      return { selectedItems: selectedItems.concat(s.id) };
    });
  },
  handleSelectAll: (allData: CartItemRes) => {
    set({ selectedItems: allData.map((cartItem) => cartItem.id) });
  },
  handleUnselectAll: () => {
    set({ selectedItems: [] });
  },
}));
