import { CartItemRes } from '@project-lc/shared-types';
import create from 'zustand';

export interface ICartStore {
  selectedItems: number[];
  handleToggle: (s: CartItemRes[number]) => void;
  handleSelectAll: (allData: CartItemRes) => void;
  handleUnselectAll: () => void;
}
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
