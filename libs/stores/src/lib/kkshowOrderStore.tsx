import create from 'zustand';

export interface KkshowOrder {
  handlePaymentType(value: string): void;
  handleAddressType(value: string): void;
  handlePaymentAmount(value: number): void;
  paymentType: '카드' | '계좌이체' | '가상계좌' | '미선택';
  addressType: 'default' | 'manual' | 'list';
  paymentAmount: number;
}
export const useKkshowOrderStore = create<KkshowOrder>((set, get) => ({
  paymentType: '미선택',
  addressType: 'manual',
  paymentAmount: 0,
  handlePaymentType(value: '카드' | '계좌이체' | '가상계좌' | '미선택') {
    set({
      paymentType: value,
    });
  },
  handleAddressType(value: 'default' | 'manual' | 'list') {
    set({
      addressType: value,
    });
  },
  handlePaymentAmount(value: number) {
    set({ paymentAmount: value });
  },
}));
