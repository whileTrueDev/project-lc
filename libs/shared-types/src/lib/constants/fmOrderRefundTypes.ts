import { FmOrderRefund } from '../res-types/fmOrder.res';

export const fmOrderRefundTypes: Record<FmOrderRefund['refund_type'], string> = {
  cancel_payment: '결제취소',
  return: '반품환불',
  shipping_price: '배송비환불',
};

export const convertFmRefundTypesToString = (
  status: FmOrderRefund['refund_type'],
): string => {
  return fmOrderRefundTypes[status];
};
