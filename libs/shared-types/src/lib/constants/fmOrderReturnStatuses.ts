import { FmOrderReturn } from '../res-types/fmOrder.res';

export const fmOrderReturnStatuses: Record<
  FmOrderReturn['status'],
  { name: string; chakraColor: string }
> = {
  request: { name: '반품요청', chakraColor: 'orange' },
  ing: { name: '반품진행중', chakraColor: 'pink' },
  complete: { name: '반품완료', chakraColor: 'red' },
};

export const convertFmReturnStatusToString = (
  status: FmOrderReturn['status'],
): string => {
  return fmOrderReturnStatuses[status].name;
};

export const getFmReturnStatusColor = (status: FmOrderReturn['status']): string => {
  return fmOrderReturnStatuses[status].chakraColor;
};

export const returnStatusNames = ['request', 'ing', 'complete'];
