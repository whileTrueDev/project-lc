export type ShippingOptionType =
  | 'free'
  | 'fixed'
  | 'amount'
  | 'amount_rep'
  | 'cnt'
  | 'cnt_rep'
  | 'weight'
  | 'weight_rep';
export type ShippingOptionSetType = 'std' | 'add';

export interface ShippingOption {
  // 임시 id
  tempId: number;
  // 배송설정 타입 std - 기본 / add - 추가
  shippingSetType: ShippingOptionSetType;
  // 배송방법 타입 - free - 무료 / fixed - 고정 / amount - 금액 / cnt - 수량 / weight - 무게
  shippingOptType: ShippingOptionType;
  // 시작구간
  sectionStart: null | number;
  // 끝구간
  sectionEnd: null | number;

  // 배송비 - 퍼스트몰 db는 지역추가시 ShippingCostType이 배열로 들어가나 복잡하고 구현하기 어려워서 하나만 적용 가능하도록 함
  costItem: ShippingCostType;
}

export interface ShippingCostType {
  // 지역명
  areaName: string;
  // 해당 지역그룹의 배송비
  cost: number;
  // // 지역그룹에 속하는 주소(시도명) - shipping_option.delivery_limit 값이 limit 인 경우
  // areaDetail?: string[];
}
