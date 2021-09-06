import { ShippingSetCodeOptions } from '../constants/shippingTypes';

// 배송설정 - 선불/착불정보
export type PrepayInfo = 'all' | 'delivery' | '';
// 배송 설정 생성 폼 데이터 타입
export interface ShippingSetFormData {
  // 임시 id
  tempId: number;
  // 배송설정 코드
  shippingSetCode: keyof typeof ShippingSetCodeOptions;
  // 배송설정명
  shippingSetName: string;
  // 착불/선불 정보
  prepayInfo: PrepayInfo;
  // 반품 배송비 - 편도
  refundShippingCost: number;
  // 반품 배송비 - (맞)교환
  swapShippingCost: number;
  // 무료배송시 반품왕복배송비 받을지 여부(fm_shipping_set.shiping 옵션에 대응하는 값. 해당 컬럼 이름 따라간거)
  shipingFreeFlag: boolean;
  // 배송비 옵션
  shippingOptions: ShippingOption[];
}

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
