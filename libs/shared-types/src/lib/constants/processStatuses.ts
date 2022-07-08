import { ProcessStatus } from '@prisma/client';

/** 반품,환불,재배송 등 상태 */
export const processStatuses: Record<
  ProcessStatus,
  { name: string; chakraColor: string }
> = {
  requested: { name: '요청', chakraColor: 'orange' },
  processing: { name: '진행중', chakraColor: 'pink' },
  complete: { name: '완료', chakraColor: 'green' },
  canceled: { name: '취소된', chakraColor: 'red' },
};

export const convertProcessStatusToString = (status: ProcessStatus): string => {
  return processStatuses[status].name;
};

export const getProcessStatusColor = (status: ProcessStatus): string => {
  return processStatuses[status].chakraColor;
};
