import { ShippingSetFormData } from './shippingSetFormType';

// bundle: 묶음계산 - 묶음배송,(default)
// each: 개별계산 - 개별배송,
// free: 무료계산 - 묶음배송
export type ShippingCalculType = 'bundle' | 'each' | 'free';

// 배송비 정책 그룹 생성 폼 데이터 타입
export interface ShippingPolicyFormData {
  // 배송그룹명
  groupName: string;
  // 배송비 계산 기준
  shippingCalculType: ShippingCalculType;

  // 배송비 추가 설정
  shippingStdFree: boolean; // 기본배송비 무료화
  shippingAddFree: boolean; // 추가배송비 무료화

  // 반송지
  postalCode: string; // 우편번호
  baseAddress: string; // 기본주소
  detailAddress: string; // 상세주소

  // 배송설정
  shippingSets: ShippingSetFormData[];
}
