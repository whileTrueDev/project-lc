import create from 'zustand';

interface GoodsViewStore {
  selected: number;
  handleSelect: (num: number) => void;
}
export const useGoodsViewStore = create<GoodsViewStore>((set, get) => ({
  selected: 0,
  handleSelect: (num: number) => {
    set({ selected: num });
  },
}));
