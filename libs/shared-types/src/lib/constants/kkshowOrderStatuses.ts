/* eslint-disable @typescript-eslint/explicit-function-return-type */

export type kkshowOrderStatusEnglishString =
  | 'orderReceived'
  | 'paymentConfirmed'
  | 'goodsReady'
  | 'partialExportReady'
  | 'exportReady'
  | 'partialExportDone'
  | 'exportDone'
  | 'partialShipping'
  | 'shipping'
  | 'partialShippingDone'
  | 'shippingDone'
  | 'purchaseConfirmed'
  | 'paymentCanceled'
  | 'orderInvalidated'
  | 'paymentFailed';

export interface KkshowOrderStatus {
  name:
    | '주문접수'
    | '결제확인'
    | '상품준비'
    | '부분출고준비'
    | '출고준비'
    | '부분출고완료'
    | '출고완료'
    | '부분배송중'
    | '배송중'
    | '부분배송완료'
    | '배송완료'
    | '구매확정'
    | '결제취소'
    | '주문무효'
    | '결제실패';
  chakraColor: string;
}

export const kkshowOrderStatusNames = [
  '주문접수',
  '결제확인',
  '상품준비',
  '부분출고준비',
  '출고준비',
  '부분출고완료',
  '출고완료',
  '부분배송중',
  '배송중',
  '부분배송완료',
  '배송완료',
  '구매확정',
  '결제취소',
  '주문무효',
  '결제실패',
];
export const kkshowOrderStatuses: Record<
  kkshowOrderStatusEnglishString,
  KkshowOrderStatus
> = {
  orderReceived: { name: '주문접수', chakraColor: 'yellow' },
  paymentConfirmed: { name: '결제확인', chakraColor: 'green' },
  goodsReady: { name: '상품준비', chakraColor: 'cyan' },
  partialExportReady: { name: '부분출고준비', chakraColor: 'teal' },
  exportReady: { name: '출고준비', chakraColor: 'teal' },
  partialExportDone: { name: '부분출고완료', chakraColor: 'blue' },
  exportDone: { name: '출고완료', chakraColor: 'blue' },
  partialShipping: { name: '부분배송중', chakraColor: 'purple' },
  shipping: { name: '배송중', chakraColor: 'purple' },
  partialShippingDone: { name: '부분배송완료', chakraColor: 'messenger' },
  shippingDone: { name: '배송완료', chakraColor: 'messenger' },
  purchaseConfirmed: { name: '구매확정', chakraColor: 'orange' }, // '80' : 구매확정 - 임의로 추가함
  paymentCanceled: { name: '결제취소', chakraColor: 'gray' },
  orderInvalidated: { name: '주문무효', chakraColor: 'gray' },
  paymentFailed: { name: '결제실패', chakraColor: 'gray' },
};

/**
 * 주문 상태에 따른 주문 상태 한글 이름을 반환합니다.
 * @param key 주문 상태 번호
 * @returns 주문 상태 이름
 */
export function convertkkshowOrderStatusToString(key: keyof typeof kkshowOrderStatuses) {
  return kkshowOrderStatuses[key].name;
}

/**
 * 주문 상태에 따른 주문 색상을 반환합니다.
 * @param key 주문 상태번호
 * @returns 주문 색상
 */
export function getkkshowOrderStatusColor(key: keyof typeof kkshowOrderStatuses) {
  return kkshowOrderStatuses[key].chakraColor;
}
