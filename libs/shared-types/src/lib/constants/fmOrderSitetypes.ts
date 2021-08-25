import { FmOrder } from '../res-types/fmOrder.res';

type FmOrderSitetypes = Record<FmOrder['sitetype'], string>;
export const fmOrderSitetypes: FmOrderSitetypes = {
  P: 'PC',
  M: '모바일',
  OFFLINE: 'PC',
  OFFLINEM: 'PC',
  APP_ANDROID: '안드로이드',
  APP_IOS: 'iOS',
  POS: '매장',
  F: '페이스북',
};

export function converOrderSitetypeToString(key: keyof FmOrderSitetypes) {
  return fmOrderSitetypes[key];
}
