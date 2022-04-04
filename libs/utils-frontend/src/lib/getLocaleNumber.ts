import { Decimal } from '@prisma/client/runtime';

export const getLocaleNumber = (num?: number | string | Decimal): string => {
  if (!num) return '0';
  if (Number.isNaN(num)) return Number(num).toLocaleString();
  return num.toLocaleString();
};
