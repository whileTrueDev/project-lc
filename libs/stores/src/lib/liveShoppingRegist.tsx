import create from 'zustand';

export interface LiveShoppingRegistForm {
  selectedGoods: string;
  mail: string;
  phoneNumber: string;
  requests: string;
  handleGoodsSelect(value: string): void;
  handleEmailInput(value: string): void;
  handlePhoneNumberInput(value: string): void;
  handleRequestsInput(e: React.ChangeEvent<HTMLInputElement>): void;
}

export const liveShoppingRegist = create<LiveShoppingRegistForm>((set, get) => ({
  selectedGoods: '',
  mail: '',
  phoneNumber: '',
  requests: '',
  handleGoodsSelect: (value) => {
    set((state) => ({
      ...state,
      selectedGoods: value,
    }));
  },
  handleEmailInput: (value) => {
    set((state) => ({
      ...state,
      mail: value,
    }));
  },
  handlePhoneNumberInput: (value) => {
    set((state) => ({
      ...state,
      phoneNumber: value,
    }));
  },
  handleRequestsInput: (e) => {
    set((state) => ({
      ...state,
      requests: e.target.value,
    }));
  },
}));
