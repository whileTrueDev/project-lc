import { FmOrderRefund } from '../res-types/fmOrder.res';

export const fmOrderRefundStatses: Record<
  FmOrderRefund['status'],
  { name: string; chakraColor: string }
> = {
  request: { name: '환불요청', chakraColor: 'orange' },
  ing: { name: '환불진행중', chakraColor: 'pink' },
  complete: { name: '환불완료', chakraColor: 'red' },
};

export const convertFmRefundStatusToString = (
  status: FmOrderRefund['status'],
): string => {
  return fmOrderRefundStatses[status].name;
};

export const getFmRefundStatusColor = (status: FmOrderRefund['status']): string => {
  return fmOrderRefundStatses[status].chakraColor;
};
