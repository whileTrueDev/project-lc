import create from 'zustand';

interface GoodsViewStore {
  selectedNavIdx: number;
  handleSelect: (num: number) => void;
}
export const useGoodsViewStore = create<GoodsViewStore>((set, get) => ({
  selectedNavIdx: 0,
  handleSelect: (num: number) => {
    set({ selectedNavIdx: num });
  },
}));
