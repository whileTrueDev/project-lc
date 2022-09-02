import { OrderProcessStep } from '@prisma/client';

/** 주문에서 중복제거된 주문상품옵션 상태 배열을 반환합니다. */
export const getOrderItemOptionSteps = (order?: {
  orderItems: { options: { step: OrderProcessStep }[] }[];
}): OrderProcessStep[] => {
  return [
    ...new Set(order?.orderItems.map((oi) => oi.options.map((oio) => oio.step)).flat()),
  ];
};

export default getOrderItemOptionSteps;
