import { FindFmOrderDetailRes, getFmOrderStatusByNames } from '@project-lc/shared-types';
import { useMemo } from 'react';

export interface OrderExportableCheck {
  isDone: boolean | undefined;
  isExportable: boolean;
}
export const useOrderExportableCheck = (
  order?: FindFmOrderDetailRes,
): OrderExportableCheck => {
  // 이미 출고가 끝난 주문 인지 확인
  const isDone = useMemo(() => {
    return order?.items.every((i) => {
      return i.options.every((o) => {
        // 남은 개수가 0이거나 0보다 작을 때
        const rest = o.ea - o.step55 - o.step65 - o.step75 - o.step85;
        return (
          getFmOrderStatusByNames(['배송중', '배송완료']).includes(order?.step) ||
          rest <= 0
        );
      });
    });
  }, [order?.items, order?.step]);

  // 출고를 진행할 수 있는 주문인 지 확인
  const isExportable = useMemo(() => {
    return !order?.items.every((i) => {
      return i.options.every((o) => {
        return getFmOrderStatusByNames(['주문무효', '결제실패', '결제취소']).includes(
          order?.step,
        );
      });
    });
  }, [order?.items, order?.step]);

  if (!order) return { isDone: false, isExportable: false };

  return {
    isDone,
    isExportable,
  };
};
