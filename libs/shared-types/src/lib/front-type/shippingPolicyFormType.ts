export type ShippingCalculType = 'free' | 'bundle' | 'each';

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
}
