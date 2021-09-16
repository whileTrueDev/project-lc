/* eslint-disable camelcase */
import {
  PrepayInfo,
  ShippingCalculType,
  ShippingCost,
  ShippingSet,
  ShippingSetCode,
} from '@prisma/client';
import { ShippingOptionDto } from '../dto/shippingOption.dto';
import { ShippingSetDto } from '../dto/shippingSet.dto';

// 배송비 계산 기준 -----------------------------------------------
export const ShippingCalculTypes: ShippingCalculType[] = ['bundle', 'each', 'free'];
export const ShippingCalculTypeOptions: Record<
  ShippingCalculType,
  { label: string; desc: string }
> = {
  bundle: {
    label: '묶음계산-묶음배송',
    desc: '본 배송그룹이 적용된 해당 상품(추가구성상품 포함)들의 배송비를 묶어서 계산합니다.',
  },
  each: {
    label: '개별계산-개별배송',
    desc: '본 배송그룹이 적용된 해당 상품(추가구성상품 포함)들의 배송비를 각각 계산합니다.',
  },
  free: {
    label: '무료계산-묶음배송',
    desc: '본 배송그룹이 적용된 해당 상품(추가구성상품 포함)들의 기본 배송비는 무료. 단, 추가 배송비(도서산간, 희망배송일) 는 설정에 따라 부과 가능합니다.',
  },
};

// 최대 배송비 입력값-----------------------------------------------
export const MAX_COST = 999999999;

// 배송방법 -----------------------------------------------
export const ShippingSetCodeOptions = {
  delivery: { label: '택배' },
  direct_delivery: { label: '직접배송' },
  quick: { label: '퀵서비스' },
  freight: { label: '화물배송' },
  direct_store: { label: '매장수령' },
  custom: { label: '직접입력' },
};
export const ShippingSetCodes: Array<ShippingSetCode> = [
  'delivery',
  'direct_delivery',
  'quick',
  'freight',
  'direct_store',
  'custom',
];

// 선불/착불정보 fm_shipping_set.prepay_info -----------------------------------------------
export const PrepayInfoOptions = {
  all: { label: '착불/선불' },
  delivery: { label: '선불' },
  postpaid: { label: '착불' },
};

export const PrepayInfoTypes: Array<PrepayInfo> = ['delivery', 'postpaid', 'all'];

// dto 타입 ---------------------------------------------------------------------
export type TempShippingOption = ShippingOptionDto & { tempId: number };

export type ShippingSetDtoType = Omit<
  ShippingSet,
  'id' | 'shipping_group_seq' | 'refund_shiping_cost' | 'swap_shiping_cost'
> & {
  refund_shiping_cost: number | null;
  swap_shiping_cost: number | null;
};

export type TempShippingSet = ShippingSetDto & { tempId: number };

export type ShippingCostDtoType = Omit<
  ShippingCost,
  'id' | 'shipping_opt_seq' | 'shipping_cost'
> & {
  shipping_cost: number;
};
