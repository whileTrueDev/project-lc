import { OrderProcessStep } from '@prisma/client';

export type OrderStatusNumString =
  | '15'
  | '25'
  | '35'
  | '40'
  | '45'
  | '50'
  | '55'
  | '60'
  | '65'
  | '70'
  | '75'
  | '80' // '80' : 구매확정 - 임의로 추가함
  | '85'
  | '95'
  | '99';

export interface OrderStatus {
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

export const orderStatuses: Record<OrderStatusNumString, OrderStatus> = {
  '15': { name: '주문접수', chakraColor: 'yellow' },
  '25': { name: '결제확인', chakraColor: 'green' },
  '35': { name: '상품준비', chakraColor: 'cyan' },
  '40': { name: '부분출고준비', chakraColor: 'teal' },
  '45': { name: '출고준비', chakraColor: 'teal' },
  '50': { name: '부분출고완료', chakraColor: 'blue' },
  '55': { name: '출고완료', chakraColor: 'blue' },
  '60': { name: '부분배송중', chakraColor: 'purple' },
  '65': { name: '배송중', chakraColor: 'purple' },
  '70': { name: '부분배송완료', chakraColor: 'messenger' },
  '75': { name: '배송완료', chakraColor: 'messenger' },
  '80': { name: '구매확정', chakraColor: 'orange' }, // '80' : 구매확정 - 임의로 추가함
  '85': { name: '결제취소', chakraColor: 'gray' },
  '95': { name: '주문무효', chakraColor: 'gray' },
  '99': { name: '결제실패', chakraColor: 'gray' },
};
export const orderProcessStepDict: Record<OrderProcessStep, OrderStatusNumString> = {
  orderReceived: '15', // 주문접수,
  paymentConfirmed: '25', // 결제확인,
  goodsReady: '35', // 상품준비,
  partialExportReady: '40', // 부분출고준비,
  exportReady: '45', // 출고준비,
  partialExportDone: '50', // 부분출고완료,
  exportDone: '55', // 출고완료,
  partialShipping: '60', // 부분배송중,
  shipping: '65', // 배송중,
  partialShippingDone: '70', // 부분배송완료,
  shippingDone: '75', // 배송완료,
  purchaseConfirmed: '80', // 구매확정(임의로 추가함)
  paymentCanceled: '85', // 결제취소,
  orderInvalidated: '95', // 주문무효,
  paymentFailed: '99', // 결제실패,
};

export function getOrderStatusColor(key: OrderProcessStep): OrderStatus['chakraColor'] {
  return orderStatuses[orderProcessStepDict[key]].chakraColor;
}

export function getOrderStatusKrString(
  key: OrderProcessStep,
): OrderStatus['chakraColor'] {
  return orderStatuses[orderProcessStepDict[key]].name;
}

/** '15' 와 같은 stringNumber로 orderReceived와 같은  OrderProcessStep 값 리턴 */
export function getOrderProcessStepNameByStringNumber(
  stringNumber: OrderStatusNumString,
): OrderProcessStep {
  const stepKey = Object.keys(orderProcessStepDict).find(
    (key: OrderProcessStep) => orderProcessStepDict[key] === stringNumber,
  );
  return stepKey as OrderProcessStep;
}

/**
 * 주문 상태 한글명 배열을 주문 상태 배열로 변경해 줍니다.
 * @param targetStatusNames 주문 상태 한글명 배열
 * @returns 주문 상태번호 배열
 */
export function getOrderStatusByNames(
  targetStatusNames: Array<typeof orderStatuses[keyof typeof orderStatuses]['name']>,
): OrderStatusNumString[] {
  const entries = Object.entries(orderStatuses);
  const filtered = entries.filter(([_, value]) => targetStatusNames.includes(value.name));
  return filtered.map(([key, v]) => key) as OrderStatusNumString[];
}

/**
 * 주문이 출고 처리가 가능한 지 확인합니다.
 */
export function isOrderExportable(step: OrderStatusNumString): boolean {
  return getOrderStatusByNames([
    '결제확인',
    '상품준비',
    '부분출고준비',
    '출고준비',
    '부분출고완료',
  ]).includes(step);
}

/** 배송조회가 가능한 주문상태목록 - 출고완료 이후 */
export const deliveryTrackingAbleSteps: OrderProcessStep[] = [
  'exportDone',
  'shipping',
  'partialShipping',
  'shippingDone',
  'partialShippingDone',
  'purchaseConfirmed',
];

/** 주문취소신청 가능한 주문상태 목록 - 상품준비 이전 */
export const orderCancellationAbleSteps: OrderProcessStep[] = [
  'orderReceived',
  'paymentConfirmed',
];

/** 재배송/환불 신청 가능한 주문상태 목록 - 상품준비 이후 */
export const exchangeReturnAbleSteps: OrderProcessStep[] = [
  'goodsReady',
  'exportReady',
  'partialExportDone',
  'exportDone',
  'partialShipping',
  'shipping',
  'partialShippingDone',
  'shippingDone',
];

/** 구매확정 신청 가능한 주문상태 목록 - 배송완료 이후 */
export const purchaseConfirmAbleSteps: OrderProcessStep[] = ['shippingDone'];

/** 리뷰작성 가능한 주문상태 목록 - 배송완료 이후 */
export const reviewAbleSteps: OrderProcessStep[] = ['shippingDone', 'purchaseConfirmed'];

/** 문의하기 "불가능한"(가능한 상태가 더 많아서) 주문상태 목록 - 주문취소, 주문무효, 결제실패 */
export const inquireDisableSteps = [
  'paymentCanceled',
  'orderInvalidated',
  'paymentFailed',
];

/** 종료된 상태들(더이상 변경되지 않는 상태) */
export const orderEndSteps = [
  'purchaseConfirmed',
  'paymentCanceled',
  'orderInvalidated',
  'paymentFailed',
];
/** 주문상태 업데이트시 고려하지 않을 주문상품옵션 상태들 */
export const skipSteps = ['paymentCanceled', 'orderInvalidated', 'paymentFailed'];

/** 출고 가능한 주문상태 목록 */
export const exportableSteps: OrderProcessStep[] = [
  'paymentConfirmed',
  'goodsReady',
  'partialExportReady',
  'exportReady',
  'partialExportDone',
];
// 판매자센터 마이페이지 주문현황
export const sellerOrderSteps = {
  shippingReady: [
    'goodsReady',
    'partialExportReady',
    'exportReady',
    'partialExportDone',
    'exportDone',
  ] as OrderProcessStep[],
  shipping: ['partialShipping', 'shipping', 'partialShippingDone'] as OrderProcessStep[],
  shippingDone: ['shippingDone'] as OrderProcessStep[],
};

export const orderProcessStepKoreanDict = {
  orderReceived: '주문접수', // 주문접수,
  paymentConfirmed: '결제확인', // 결제확인,
  goodsReady: '상품준비', // 상품준비,
  partialExportReady: '부분출고준비', // 부분출고준비,
  exportReady: '출고준비', // 출고준비,
  partialExportDone: '부분출고완료', // 부분출고완료,
  exportDone: '출고완료', // 출고완료,
  partialShipping: '부분배송중', // 부분배송중,
  shipping: '배송중', // 배송중,
  partialShippingDone: '부분배송완료', // 부분배송완료,
  shippingDone: '배송완료', // 배송완료,
  purchaseConfirmed: '구매확정', // 구매확정(임의로 추가함)
  paymentCanceled: '결제취소', // 결제취소,
  orderInvalidated: '주문무효', // 주문무효,
  paymentFailed: '결제실패', // 결제실패,
  orderCancellations: '취소요청',
  returns: '반품요청',
  refunds: '환불요청',
  exchanges: '교환요청',
};
