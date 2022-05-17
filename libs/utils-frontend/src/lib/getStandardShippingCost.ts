import { Decimal } from '@prisma/client/runtime';
import { GoodsByIdRes } from '@project-lc/shared-types';

export const getStandardShippingCost = (
  shippingGroup?: GoodsByIdRes['ShippingGroup'],
): Decimal => {
  const shippingSet = shippingGroup?.shippingSets.find(
    (set) => set.delivery_nation === 'korea',
  );
  if (!shippingSet) return null;
  const opts = shippingSet.shippingOptions.filter(
    (opt) => opt.shipping_set_type === 'std',
  );
  const defaultOpt = opts.find((o) => o.shipping_set_type === 'std');
  if (!defaultOpt) return null;
  const cost = defaultOpt?.shippingCost.find((c) => c.shipping_cost)?.shipping_cost;

  return cost;
};
