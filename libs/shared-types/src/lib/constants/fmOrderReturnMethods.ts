import { FmOrderReturnBase } from '../res-types/fmOrder.res';

export type FmReturnMethods = Record<FmOrderReturnBase['return_method'], string>;
export const fmReturnMethods: FmReturnMethods = {
  user: '택배 회수',
  shop: '자가 반품',
};

export const convertFmReturnMethodToString = (key: keyof FmReturnMethods): string => {
  return fmReturnMethods[key];
};
