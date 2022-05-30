import { GoodsCategory } from '@prisma/client';
import create from 'zustand';

export interface GoodsRegistStore {
  selectedCategory: GoodsCategory | null;
  handleCaregorySelect: (cate: GoodsCategory | null) => void;
  informationNotice: Record<string, string>;
  initializeNotice: (noticeObj: Record<string, string>) => void;
  handleChange: (key: string, value: string) => void;
}

export const goodsRegistStore = create<GoodsRegistStore>((set, get) => ({
  selectedCategory: null,
  handleCaregorySelect: (cate) => set({ selectedCategory: cate }),
  informationNotice: {},
  initializeNotice: (noticeObj: Record<string, string>) => {
    set({ informationNotice: noticeObj });
  },
  handleChange: (key: string, value: string) => {
    set((prev) => ({ informationNotice: { ...prev.informationNotice, [key]: value } }));
  },
}));
