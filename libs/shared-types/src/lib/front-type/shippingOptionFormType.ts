export type ShippingOptionType = 'free' | 'fixed' | 'amount' | 'cnt' | 'weight';
export type ShippingOptionSetType = 'std' | 'add';

export interface ShippingOption {
  // 임시 id
  tempId: number;
  // 배송설정 타입 std - 기본 / add - 추가
  shippingSetType: ShippingOptionSetType;
  // 배송방법 타입 - free - 무료 / fixed - 고정 / amount - 금액 / cnt - 수량 / weight - 무게
  shippingOptType: ShippingOptionType;
  // 배송지역 제한여부
  deliveryLimit: boolean;
  // 시작구간
  sectionStart: null | number;
  // 끝구간
  sectionEnd: null | number;
}
