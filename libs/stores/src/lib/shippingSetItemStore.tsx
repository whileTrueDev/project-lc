import {
  DeliveryLimit,
  PrepayInfo,
  ShippingOption,
  ShippingSetCodeOptions,
  ShippingSetFormData,
} from '@project-lc/shared-types';
import create from 'zustand';

export interface ShippingSetItemStoreState extends Omit<ShippingSetFormData, 'tempId'> {
  setShippingSetName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShippingSetCode: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setPrepayInfo: (prepayInfo: PrepayInfo) => void;
  setRefundShippingCost: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setWwapShippingCost: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShipingFreeFlag: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changeDeliveryLimit: (deliveryLimit: DeliveryLimit) => void;
  removeShippingOption: (id: number) => void;
  clearShippingOptions: () => void;
  addShippingOption: (option: Omit<ShippingOption, 'tempId'>) => void;
  setShippingOptions: (options: Omit<ShippingOption, 'tempId'>[]) => void;
  reset: () => void;
}

export const useShippingSetItemStore = create<ShippingSetItemStoreState>((set, get) => ({
  shippingSetCode: 'delivery',
  shippingSetName: '택배',
  prepayInfo: 'delivery',
  refundShippingCost: null,
  swapShippingCost: null,
  shipingFreeFlag: false,
  shippingOptions: [],
  deliveryLimit: 'unlimit',
  reset: () => {
    set((state) => ({
      ...state,
      shippingSetCode: 'delivery',
      shippingSetName: '택배',
      prepayInfo: 'delivery',
      refundShippingCost: null,
      swapShippingCost: null,
      shipingFreeFlag: false,
      shippingOptions: [],
      deliveryLimit: 'unlimit',
    }));
  },
  setShippingSetName: (e: React.ChangeEvent<HTMLInputElement>) => {
    set((state) => ({
      ...state,
      shippingSetName: e.currentTarget.value,
    }));
  },
  setShippingSetCode: (e: React.ChangeEvent<HTMLSelectElement>) => {
    const shippingSetCode = e.currentTarget.value as keyof typeof ShippingSetCodeOptions;
    const shippingSetName = ShippingSetCodeOptions[shippingSetCode].label;
    set((state) => ({
      ...state,
      shippingSetCode,
      shippingSetName,
    }));
  },
  setPrepayInfo: (prepayInfo: PrepayInfo) => {
    set((state) => ({
      ...state,
      prepayInfo,
    }));
  },
  setRefundShippingCost: (e: React.ChangeEvent<HTMLInputElement>) => {
    const refundShippingCost = Number(e.currentTarget.value);
    set((state) => ({
      ...state,
      refundShippingCost,
    }));
  },
  setWwapShippingCost: (e: React.ChangeEvent<HTMLInputElement>) => {
    const swapShippingCost = Number(e.currentTarget.value);
    set((state) => ({
      ...state,
      swapShippingCost,
    }));
  },
  setShipingFreeFlag: (e: React.ChangeEvent<HTMLInputElement>) => {
    set((state) => ({
      ...state,
      shipingFreeFlag: e.currentTarget.checked,
    }));
  },
  changeDeliveryLimit: (deliveryLimit: DeliveryLimit) => {
    set((state) => ({
      ...state,
      deliveryLimit,
      shippingOptions: [],
    }));
  },
  removeShippingOption: (id: number) => {
    const { shippingOptions } = get();
    const filtered = shippingOptions.filter((opt) => opt.tempId !== id);
    set((state) => ({
      ...state,
      shippingOptions: filtered,
    }));
  },
  clearShippingOptions: () => {
    set((state) => ({
      ...state,
      shippingOptions: [],
    }));
  },
  addShippingOption: (option: Omit<ShippingOption, 'tempId'>) => {
    const { shippingOptions } = get();
    const tempId =
      shippingOptions.length !== 0
        ? shippingOptions[shippingOptions.length - 1].tempId + 1
        : 0;

    const newOption = {
      tempId,
      ...option,
    };
    set((state) => ({
      ...state,
      shippingOptions: [...shippingOptions, newOption],
    }));
  },
  setShippingOptions: (options: Omit<ShippingOption, 'tempId'>[]) => {
    set((state) => ({
      ...state,
      shippingOptions: [
        ...options.map((opt, index) => ({
          ...opt,
          tempId: index,
        })),
      ],
    }));
  },
}));
