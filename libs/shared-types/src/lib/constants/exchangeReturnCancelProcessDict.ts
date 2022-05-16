import { ExchangeProcessStatus } from '@prisma/client';

type StatusValues = { name: string; color: string };
export const processTextDict: Record<ExchangeProcessStatus, StatusValues> = {
  requested: { name: '요청됨', color: 'orange' },
  collected: { name: '수거됨', color: 'yellow' },
  processing: { name: '처리진행중', color: 'pink' },
  complete: { name: '처리완료', color: 'green' },
  canceled: { name: '취소됨', color: 'grey' },
};
