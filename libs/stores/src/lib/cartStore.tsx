import { CartItemRes } from '@project-lc/shared-types';
import create from 'zustand';

export interface ICartStore {
  selectedItems: CartItemRes;
  handleToggle: (s: CartItemRes[number]) => void;
  handleSelectAll: (allData: CartItemRes) => void;
  handleUnselectAll: () => void;
}
export const useCartStore = create<ICartStore>((set) => ({
  selectedItems: [],
  handleToggle: (s: CartItemRes[number]) => {
    set(({ selectedItems }) => {
      if (selectedItems.findIndex((x) => x.id === s.id) > -1) {
        return {
          selectedItems: selectedItems.filter((x) => x.id !== s.id),
        };
      }
      return { selectedItems: selectedItems.concat(s) };
    });
  },
  handleSelectAll: (allData: CartItemRes) => {
    set({ selectedItems: allData });
  },
  handleUnselectAll: () => {
    set({ selectedItems: [] });
  },
}));
