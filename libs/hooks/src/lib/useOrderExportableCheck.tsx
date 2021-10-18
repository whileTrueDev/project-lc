import {
  FindFmOrderDetailRes,
  FmOrderOption,
  FmOrderShipping,
  getFmOrderStatusByNames,
} from '@project-lc/shared-types';
import { useMemo } from 'react';

const EXPORT_DONE_SATTUS_NAMES: Parameters<typeof getFmOrderStatusByNames>[0] = [
  '배송중',
  '배송완료',
];
const NON_EXPORTABLE_SATTUS_NAMES: Parameters<typeof getFmOrderStatusByNames>[0] = [
  '주문무효',
  '결제실패',
  '결제취소',
];

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
        const rest = getOptionRestEa(o);

        return (
          getFmOrderStatusByNames(EXPORT_DONE_SATTUS_NAMES).includes(order?.step) ||
          rest <= 0
        );
      });
    });
  }, [order?.items, order?.step]);

  // 출고를 진행할 수 있는 주문인 지 확인
  const isExportable = useMemo(() => {
    return !order?.items.every((i) => {
      return i.options.every((o) => {
        return getFmOrderStatusByNames(NON_EXPORTABLE_SATTUS_NAMES).includes(order?.step);
      });
    });
  }, [order?.items, order?.step]);

  if (!order) return { isDone: false, isExportable: false };

  return {
    isDone,
    isExportable,
  };
};

export const useOrderShippingItemsExportableCheck = (
  shipping: FmOrderShipping,
): OrderExportableCheck => {
  const isDone = useMemo(() => {
    return shipping.items.every((i) => {
      return i.options.every((o) => {
        const rest = getOptionRestEa(o);
        return (
          getFmOrderStatusByNames(EXPORT_DONE_SATTUS_NAMES).includes(o.step) || rest <= 0
        );
      });
    });
  }, [shipping.items]);

  const isExportable = useMemo(() => {
    return !shipping.items.every((i) => {
      return i.options.every((o) => {
        return getFmOrderStatusByNames(NON_EXPORTABLE_SATTUS_NAMES).includes(o.step);
      });
    });
  }, [shipping.items]);

  return {
    isDone,
    isExportable,
  };
};

function getOptionRestEa(opt: FmOrderOption): number {
  return opt.ea - opt.step55 - opt.step65 - opt.step75 - opt.step85;
}
