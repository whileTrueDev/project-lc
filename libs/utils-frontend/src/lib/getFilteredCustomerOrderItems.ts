import { OrderDataWithRelations, OrderItemWithRelations } from '@project-lc/shared-types';

/**
 * 소비자 주문목록에 표시할 주문상품 중 화면에 표시될 상품만 filter하는 함수
 * 소비자 주문목록에는 교환/환불/주문취소가 요청된 상품은 표시하지 않는다
 * 재배송/환불요청 상품 목록도 동일한 기준을 적용하여 filter한다
 */
export const getFilteredCustomerOrderItems = ({
  order,
}: {
  order: OrderDataWithRelations;
}): OrderItemWithRelations[] => {
  // 반품요청된 주문상품옵션 id[]
  const returnItemIds =
    order.returns?.flatMap((r) => r.items).map((ri) => ri.orderItemOptionId) || [];

  // 주문취소 요청된 주문상품옵션id []
  const cancelItemIds =
    order.orderCancellations?.flatMap((c) => c.items).map((ci) => ci.orderItemOptionId) ||
    [];

  // 교환요청이 완료되지 않은 주문상품옵션 id[]
  const unCompletedExchangeItemIds =
    order.exchanges
      ?.flatMap((e) => e.exchangeItems)
      .filter((ei) => ei.status !== 'complete') // 교환 요청 완료되지 않은 상품 (교환요청 완료된 경우, 재배송받은 상품에 대해 다시 교환 요청하는 경우가 존재할 수 있으므로)
      .map((ei) => ei.orderItemOptionId) || [];

  // 주문상품에 연결된 주문상품옵션 중 반품요청 있는 경우 || 주문취소 있는 경우 || 완료되지 않은 교환요청 있는경우 제외
  const filtered = order.orderItems.map((oi) => {
    return {
      ...oi,
      options: oi.options.filter(
        (opt) =>
          !returnItemIds.includes(opt.id) &&
          !unCompletedExchangeItemIds.includes(opt.id) &&
          !cancelItemIds.includes(opt.id),
      ),
    };
  });
  return filtered;
};
