import { GoodsCategory } from '@prisma/client';
import create from 'zustand';

export interface GoodsRegistStore {
  selectedCategory: GoodsCategory | null;
  handleCaregorySelect: (cate: GoodsCategory | null) => void;
  informationNotice: Record<string, string>;
  initializeNotice: (noticeObj: Record<string, string>) => void;
  handleChange: (key: string, value: string) => void;
  selectedCategories: GoodsCategory[];
  addToSelectedCategories: (cat: GoodsCategory) => void;
  removeFromSelectedCategories: (categoryId: number) => void;
  resetSelectedCategories: () => void;
  setSelectedCategories: (categories: GoodsCategory[]) => void;
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
  selectedCategories: [],
  addToSelectedCategories: (cat: GoodsCategory) => {
    const prevSelectedCategories = get().selectedCategories;
    if (!prevSelectedCategories.find((item) => item.id === cat.id)) {
      set((prev) => ({ selectedCategories: [...prev.selectedCategories, cat] }));
    }
  },
  removeFromSelectedCategories: (removeCategoryId: number) => {
    set((prev) => ({
      selectedCategories: prev.selectedCategories.filter(
        (item) => item.id !== removeCategoryId,
      ),
    }));
  },
  resetSelectedCategories: () => {
    set({ selectedCategories: [] });
  },
  setSelectedCategories: (categories: GoodsCategory[]) => {
    set({ selectedCategories: categories });
  },
}));
