import { CreateOrderForm } from '@project-lc/shared-types';
import create from 'zustand';

export const orderNeedToFillInDefault = {
  memo: '',
  orderItems: [] as CreateOrderForm['orderItems'],
  orderPrice: 0,
  paymentPrice: 0,
  ordererEmail: '',
  ordererName: '',
  ordererPhone: '',
  recipientAddress: '',
  recipientDetailAddress: '',
  recipientEmail: '',
  recipientName: '',
  recipientPhone: '',
  recipientPostalCode: '',
  usedMileageAmount: 0,
  couponId: 0,
  usedCouponAmount: 0,
  totalDiscount: 0,
  paymentType: 'card' as const,
};

/** 주문 준비 데이터 타입  */
export type OrderPrepareData = Pick<
  CreateOrderForm,
  | 'orderItems'
  | 'cartItemIdList'
  | 'giftFlag'
  | 'nonMemberOrderFlag'
  | 'orderPrice'
  | 'supportOrderIncludeFlag'
>;

export interface KkshowOrderStore {
  handlePaymentType(value: string): void;
  handleAddressType(value: string): void;
  paymentType: '카드' | '계좌이체' | '가상계좌' | '미선택';
  addressType: 'default' | 'manual' | 'list';

  // ******************************************
  // by hwasurr
  order: CreateOrderForm;
  resetOrder: () => void;
  handleOrderPrepare: (orderData: OrderPrepareData) => void;
}
export const useKkshowOrderStore = create<KkshowOrderStore>((set, get) => ({
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

  // ******************************************
  // by hwasurr
  order: orderNeedToFillInDefault,
  resetOrder: () => set({ order: orderNeedToFillInDefault }),
  /** 상품상세페이지or장바구니 -> 바로구매 주문페이지 이동 처리 */
  handleOrderPrepare: (orderPrepareData: OrderPrepareData) => {
    set(({ order: prevOrderData }) => ({
      order: {
        ...prevOrderData,
        ...orderPrepareData,
      },
    }));
  },
}));
