import { FmOrderShipping } from '../res-types/fmOrder.res';

export const fmOrderShippingTypes: Record<FmOrderShipping['shipping_type'], string> = {
  free: '무료배송',
  postpaid: '착불',
  prepay: '선불',
};

export const convertFmOrderShippingTypesToString = (
  key: FmOrderShipping['shipping_type'],
): string => {
  return fmOrderShippingTypes[key];
};
