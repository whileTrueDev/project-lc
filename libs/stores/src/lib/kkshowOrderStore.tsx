import create from 'zustand';

export interface KkshowOrderStoreState {
  mileage: number;
  coupon: number;
  handleMileageDiscount: (value: number) => void;
  handleCouponDiscount: (value: number) => void;
}

export const useKkshowOrderStore = create<KkshowOrderStoreState>((set, get) => ({
  mileage: 0,
  coupon: 0,
  handleMileageDiscount(value: number) {
    set({
      mileage: value,
    });
  },
  handleCouponDiscount(value: number) {
    set({
      coupon: value,
    });
  },
}));
