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

/** 배송비정보 타입 */
export type OrderShippingData = Record<
  number, // 배송비그룹 id
  {
    isShippingAvailable?: boolean;
    cost: { std: number; add: number } | null; // 기본배송비, 추가배송비
    items: number[]; // 해당배송비에 포함된 goodsId[]
  }
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

  // ******* 배송비 저장
  shipping: OrderShippingData;
  setShippingData: (data: OrderShippingData) => void;
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

  // ******* 배송비 저장
  shipping: {},
  setShippingData: (data: OrderShippingData) => {
    set({ shipping: data });
  },
}));
