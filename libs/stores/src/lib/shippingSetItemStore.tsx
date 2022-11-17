import {
  LimitOrUnlimit,
  PrepayInfo,
  ShippingSetCode,
  ShippingSetType,
} from '@prisma/client';
import {
  MAX_COST,
  ShippingOptionDto,
  ShippingSetCodeOptions,
  ShippingSetDto,
} from '@project-lc/shared-types';
import create from 'zustand';

export interface ShippingSetItemStoreState extends ShippingSetDto {
  setShippingSetName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShippingSetCode: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setPrepayInfo: (prepayInfo: PrepayInfo) => void;
  setRefundShippingCost: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSwapShippingCost: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShipingFreeFlag: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changeDeliveryLimit: (deliveryLimit: LimitOrUnlimit) => void;
  removeShippingOption: (id: number) => void;
  clearShippingOptions: (setType?: ShippingSetType) => void;
  addShippingOption: (option: Omit<ShippingOptionDto, 'tempId'>) => void;
  setShippingOptions: (options: Omit<ShippingOptionDto, 'tempId'>[]) => void;
  changeShippingOption: (
    index: number,
    newOption: Omit<ShippingOptionDto, 'tempId'>,
  ) => void;
  reset: () => void;
}

/** 배송설정(ShippingSet) 생성하기 위한 데이터 관리 */
export const useShippingSetItemStore = create<ShippingSetItemStoreState>((set, get) => ({
  shipping_set_code: 'delivery',
  shipping_set_name: '택배',
  prepay_info: 'delivery',
  refund_shiping_cost: null,
  swap_shiping_cost: null,
  shiping_free_yn: 'N',
  shippingOptions: [],
  delivery_limit: 'unlimit',
  default_yn: 'N',
  delivery_nation: 'korea',
  reset: () => {
    set((state) => ({
      ...state,
      shipping_set_code: 'delivery',
      shipping_set_name: '택배',
      prepay_info: 'delivery',
      refund_shiping_cost: null,
      swap_shiping_cost: null,
      shiping_free_yn: 'N',
      shippingOptions: [],
      delivery_limit: 'unlimit',
    }));
  },
  setShippingSetName: (e: React.ChangeEvent<HTMLInputElement>) => {
    set((state) => ({
      ...state,
      shipping_set_name: e.currentTarget.value,
    }));
  },
  setShippingSetCode: (e: React.ChangeEvent<HTMLSelectElement>) => {
    const shippingSetCode = e.currentTarget.value as ShippingSetCode;
    const shippingSetName = ShippingSetCodeOptions[shippingSetCode].label;
    set((state) => ({
      ...state,
      shipping_set_code: shippingSetCode,
      shipping_set_name: shippingSetName,
    }));
  },
  setPrepayInfo: (prepayInfo: PrepayInfo) => {
    set((state) => ({
      ...state,
      prepay_info: prepayInfo,
    }));
  },
  setRefundShippingCost: (e: React.ChangeEvent<HTMLInputElement>) => {
    const refundShippingCost = Number(e.currentTarget.value);
    set((state) => ({
      ...state,
      refund_shiping_cost: Math.min(refundShippingCost, MAX_COST),
    }));
  },
  setSwapShippingCost: (e: React.ChangeEvent<HTMLInputElement>) => {
    const swapShippingCost = Number(e.currentTarget.value);
    set((state) => ({
      ...state,
      swap_shiping_cost: Math.min(swapShippingCost, MAX_COST),
    }));
  },
  setShipingFreeFlag: (e: React.ChangeEvent<HTMLInputElement>) => {
    set((state) => ({
      ...state,
      shiping_free_yn: e.currentTarget.checked ? 'Y' : 'N',
    }));
  },
  changeDeliveryLimit: (deliveryLimit: LimitOrUnlimit) => {
    set((state) => ({
      ...state,
      delivery_limit: deliveryLimit,
      shippingOptions: [],
    }));
  },
  removeShippingOption: (id: number) => {
    const { shippingOptions } = get();

    const optionIdx = shippingOptions.findIndex((opt) => opt.tempId === id);
    // 옵션이 존재하지 않으면 return
    if (optionIdx === -1) return;

    if (shippingOptions[optionIdx].shipping_opt_type.includes('rep')) {
      // 구간반복 옵션인 경우, 2개씩 삭제
      shippingOptions.splice(optionIdx - 1, 2);
      set((state) => ({
        ...state,
        shippingOptions,
      }));
    } else {
      // 구간반복이 아닌경우 1개씩 삭제
      const filtered = shippingOptions.filter((opt) => opt.tempId !== id);
      set((state) => ({
        ...state,
        shippingOptions: filtered,
      }));
    }
  },
  clearShippingOptions: (setType?: ShippingSetType) => {
    const { shippingOptions } = get();
    // ShippingOptionType 값이 ㅂㅏ꾸ㅣ면 해당 ShippingSetType타입인 옵션을 삭제
    // 값이 없으면 전체 삭제
    set((state) => ({
      ...state,
      shippingOptions: setType
        ? shippingOptions.filter((opt) => opt.shipping_set_type !== setType)
        : [],
    }));
  },
  addShippingOption: (option: Omit<ShippingOptionDto, 'tempId'>) => {
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
  setShippingOptions: (options: Omit<ShippingOptionDto, 'tempId'>[]) => {
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
  changeShippingOption: (index: number, newOption: Omit<ShippingOptionDto, 'tempId'>) => {
    const { shippingOptions } = get();
    const { tempId } = shippingOptions[index];
    shippingOptions.splice(index, 1, { ...newOption, tempId });
    set((state) => ({
      ...state,
      shippingOptions,
    }));
  },
}));
