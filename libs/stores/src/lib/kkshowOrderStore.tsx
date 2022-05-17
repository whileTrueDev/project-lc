import create from 'zustand';

export interface KkshowOrder {
  handlePaymentType(value: string): void;
  handleAddressType(value: string): void;
  paymentType: '카드' | '계좌이체' | '가상계좌' | '미선택';
  addressType: 'default' | 'manual' | 'list';
}
export const useKkshowOrderStore = create<KkshowOrder>((set, get) => ({
  paymentType: '미선택',
  addressType: 'manual',
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
}));
