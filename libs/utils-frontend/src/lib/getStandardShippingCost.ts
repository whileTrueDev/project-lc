import { Decimal } from '@prisma/client/runtime';
import { GoodsByIdRes } from '@project-lc/shared-types';

/** 기본 배송비 조회 */
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
  // 구간시작값 오름차순으로 정렬한 후 첫번째 옵션 선택
  opts.sort((a, b) => a.section_st - b.section_st);
  const defaultOpt = opts.find((o) => o.shipping_set_type === 'std');
  if (!defaultOpt) return null;

  const cost = defaultOpt?.shippingCost.find((c) => c.shipping_cost)?.shipping_cost;

  return cost;
};
