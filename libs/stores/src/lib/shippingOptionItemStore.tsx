import { ShippingCost, ShippingOption } from '@project-lc/shared-types';
import create from 'zustand';

export interface ShippintOptionItemStoreState extends Omit<ShippingOption, 'tempId'> {
  data: Omit<ShippingOption, 'tempId'>;
}

const defaultCostItem: ShippingCost = {
  tempId: 0,
  areaName: '대한민국',
  cost: 2500,
};

export const useShippingOptionItemStore = create<ShippintOptionItemStoreState>(
  (set, get) => ({
    get data() {
      const { shippingSetType, shippingOptType, sectionStart, sectionEnd, costItem } =
        get();
      return {
        shippingSetType,
        shippingOptType,
        sectionStart,
        sectionEnd,
        costItem,
      };
    },
    shippingSetType: 'std',
    shippingOptType: 'free',
    sectionStart: null,
    sectionEnd: null,
    costItem: defaultCostItem,
  }),
);
