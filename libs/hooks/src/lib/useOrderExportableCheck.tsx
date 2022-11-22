import { OrderProcessStep } from '@prisma/client';
import {
  exportableSteps,
  OrderDetailRes,
  OrderDetailShipping,
} from '@project-lc/shared-types';
import { useMemo } from 'react';

const EXPORT_DONE_SATTUS_NAMES: OrderProcessStep[] = [
  OrderProcessStep.shipping,
  OrderProcessStep.shippingDone,
  OrderProcessStep.exportDone,
  OrderProcessStep.purchaseConfirmed,
  OrderProcessStep.partialShipping,
  OrderProcessStep.partialShippingDone,
];

export interface OrderExportableCheck {
  isDone: boolean | undefined;
  isExportable: boolean;
}
export const useOrderExportableCheck = (order?: OrderDetailRes): OrderExportableCheck => {
  // 이미 출고가 끝난 주문 인지 확인
  const isDone = useMemo(() => {
    return order?.orderItems.every((i) => {
      return i.options.every((o) => EXPORT_DONE_SATTUS_NAMES.includes(o.step));
    });
  }, [order?.orderItems]);

  // 출고를 진행할 수 있는 주문인 지 확인
  const isExportable = useMemo(() => {
    return !!order?.orderItems.some((i) => {
      return i.options.some((o) => exportableSteps.includes(o.step));
    });
  }, [order?.orderItems]);

  if (!order) return { isDone: false, isExportable: false };
  return { isDone, isExportable };
};

export const useOrderShippingItemsExportableCheck = (
  shipping: OrderDetailShipping,
): OrderExportableCheck => {
  const isDone = useMemo(() => {
    return checkShippingExportIsDone(shipping);
  }, [shipping]);
  const isExportable = useMemo(() => {
    return checkShippingCanExport(shipping);
  }, [shipping]);
  return { isDone, isExportable };
};

export const checkShippingCanExport = (shipping: OrderDetailShipping): boolean => {
  const isExportable = !!shipping.items.some((i) => {
    return i.options.some((o) => exportableSteps.includes(o.step));
  });
  return !!isExportable;
};

export const checkShippingExportIsDone = (shipping: OrderDetailShipping): boolean => {
  return shipping.items.every((i) => {
    return i.options.every((o) => EXPORT_DONE_SATTUS_NAMES.includes(o.step));
  });
};
