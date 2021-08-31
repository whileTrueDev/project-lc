import { FmOrderReturnBase } from '../res-types/fmOrder.res';

export const fmOrderReturnTypes: Record<FmOrderReturnBase['return_type'], string> = {
  exchange: '맞교환',
  return: '반품',
};

export const convertFmReturnTypesToString = (
  status: FmOrderReturnBase['return_type'],
): string => {
  return fmOrderReturnTypes[status];
};
