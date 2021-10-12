import create from 'zustand';

export interface LiveShoppingRegistForm {
  selectedGoods: string;
  setDefault: boolean;
  handleGoodsSelect(value: string): void;
  handleSetDefault(value: boolean): void;
}

export const liveShoppingRegist = create<LiveShoppingRegistForm>((set, get) => ({
  selectedGoods: '',
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
