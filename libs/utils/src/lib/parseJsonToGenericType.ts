import { Prisma } from '@prisma/client';

/** JSON데이터인 value를 특정 타입으로 캐스팅하여 반환 */
export const parseJsonToGenericType = <T>(value: JSON | Prisma.JsonValue): T => {
  if (typeof value === 'object') return value as T;
  if (typeof value === 'string') return JSON.parse(value) as T;
  return JSON.parse(JSON.stringify(value));
};
