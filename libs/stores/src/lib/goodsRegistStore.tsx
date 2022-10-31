import { GoodsCategory } from '@prisma/client';
import create from 'zustand';

export interface GoodsRegistStore {
  /** 상품정보제공고시 품목별 필수정보 저장 */
  informationNotice: Record<string, string>;
  initializeNotice: (noticeObj: Record<string, string>) => void;
  /** 상품정보제공고시 품목별 필수정보 변경 핸들러 */
  handleChange: (key: string, value: string) => void;

  /** 상품정보제공고시 품목 id */
  informationSubjectId: number | null;
  setInformationSubjectId: (id: number | null) => void;

  /** --- 카테고리 관련 ------- */
  selectedCategories: GoodsCategory[];
  addToSelectedCategories: (cat: GoodsCategory) => void;
  removeFromSelectedCategories: (categoryId: number) => void;
  resetSelectedCategories: () => void;
  setSelectedCategories: (categories: GoodsCategory[]) => void;
}

/** 상품 생성을 위한 정보(상품정보제공고시, 카테고리) 관리 */
export const goodsRegistStore = create<GoodsRegistStore>((set, get) => ({
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
  informationSubjectId: null,
  setInformationSubjectId: (id: number | null) => {
    set({ informationSubjectId: id });
  },
}));
