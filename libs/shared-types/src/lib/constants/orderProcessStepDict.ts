import { OrderProcessStep } from '@prisma/client';
import { FmOrderStatusNumString } from './fmOrderStatuses';

export const orderProcessStepDict: Record<OrderProcessStep, FmOrderStatusNumString> = {
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

/** '15' 와 같은 stringNumber로 orderReceived와 같은  OrderProcessStep 값 리턴 */
export function getOrderProcessStepNameByStringNumber(
  stringNumber: FmOrderStatusNumString,
): OrderProcessStep {
  const stepKey = Object.keys(orderProcessStepDict).find(
    (key) => orderProcessStepDict[key] === stringNumber,
  );
  return stepKey as OrderProcessStep;
}

/** 배송조회가 가능한 주문상태목록 - 출고완료 이후 */
export const deliveryTrackingAbleSteps: OrderProcessStep[] = [
  'exportDone',
  'shipping',
  'shippingDone',
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
