import { Decimal } from '@prisma/client/runtime';

export const getLocaleNumber = (num?: number | string | Decimal): string => {
  if (num === 0) return '0';
  if (!num) return '';
  const converted = Number(num);
  if (Number.isNaN(converted)) return num.toLocaleString();
  return converted.toLocaleString();
};
