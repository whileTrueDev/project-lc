import { CreateOrderForm, ShippingCostByShippingGroupId } from '@project-lc/shared-types';
import create from 'zustand';
import { persist } from 'zustand/middleware';

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
export type OrderPrepareData = Partial<CreateOrderForm>;

/** 배송비정보 타입 */
export type OrderShippingData = ShippingCostByShippingGroupId;
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
export const useKkshowOrderStore = create<KkshowOrderStore>(
  // 로컬스토리지 사용 => 결제완료 후(토스페이먼츠 결제요청 이후) Order 데이터 생성하려고 하는데 리다이렉트 이후 store에 있는 데이터가 사라져서
  persist(
    (set, get) => ({
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
    }),
    { name: 'kkshow-order-storage' }, // 로컬스토리지 키값(고유식별값)
  ),
);
