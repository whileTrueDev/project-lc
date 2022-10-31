import create from 'zustand';
import { ApprovedGoodsListItem } from '@project-lc/shared-types';

export interface LiveShoppingRegistForm {
  selectedGoods: ApprovedGoodsListItem | null;
  setDefault: boolean;
  handleGoodsSelect(value: ApprovedGoodsListItem | null): void;
  handleSetDefault(value: boolean): void;
}

/** 라이브쇼핑 등록 위한 정보(선택된 상품) 관리 */
export const liveShoppingRegist = create<LiveShoppingRegistForm>((set) => ({
  selectedGoods: null,
  setDefault: true,
  handleGoodsSelect: (value) => {
    set((state) => ({
      ...state,
      selectedGoods: value,
    }));
  },
  handleSetDefault: (value) => {
    set((state) => ({
      ...state,
      setDefault: value,
    }));
  },
}));
