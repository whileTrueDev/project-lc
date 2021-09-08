import { ShippingSetCodeOptions } from '../constants/shippingTypes';
import { ShippingOption } from './shippingOptionFormType';

// 배송설정 - 선불/착불정보
export type PrepayInfo = 'all' | 'delivery' | 'postpaid';
//  배송지역 제한 - unlimit - 전국(전세계) / limit - 지정지역(국가)
export type DeliveryLimit = 'limit' | 'unlimit';
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
  refundShippingCost: number | null;
  // 반품 배송비 - (맞)교환
  swapShippingCost: number | null;
  // 무료배송시 반품왕복배송비 받을지 여부(fm_shipping_set.shiping 옵션에 대응하는 값. 해당 컬럼 이름 따라간거)
  shipingFreeFlag: boolean;
  // 배송비 옵션
  shippingOptions: ShippingOption[];
  //  배송지역 제한 - unlimit - 전국(전세계) / limit - 지정지역(국가)
  deliveryLimit: DeliveryLimit;
}
