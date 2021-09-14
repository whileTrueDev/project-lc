/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-empty-function */
import { ShippingCalculType } from '@prisma/client';
import { ShippingGroupDto, ShippingSetDto } from '@project-lc/shared-types';
import create from 'zustand';

export interface ShippingGroupItemStoreState extends ShippingGroupDto {
  setGroupName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShippingCalculType: (type: ShippingCalculType) => void;
  clearShippingAdditionalSetting: () => void;
  setShippingStdFree: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShippingAddFree: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setAddress: (postalCode: string, baseAddress: string) => void;
  setDetailAddress: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addShippingSet: (item: ShippingSetDto) => void;
  removeShippingSet: (id: number) => void;
  reset: () => void;
}
export const useShippingGroupItemStore = create<ShippingGroupItemStoreState>(
  (set, get) => ({
    shipping_group_name: '',
    shipping_calcul_type: 'bundle',
    shipping_calcul_free_yn: 'N',
    shipping_std_free_yn: 'N',
    shipping_add_free_yn: 'N',
    postalCode: '',
    baseAddress: '',
    detailAddress: '',
    shippingSets: [],
    reset: () => {
      set((state) => ({
        ...state,
        shipping_group_name: '',
        shipping_calcul_type: 'bundle',
        shipping_calcul_free_yn: 'N',
        shipping_std_free_yn: 'N',
        shipping_add_free_yn: 'N',
        postalCode: '',
        baseAddress: '',
        detailAddress: '',
        shippingSets: [],
      }));
    },
    setGroupName: (e: React.ChangeEvent<HTMLInputElement>) => {
      const newGroupName = e.currentTarget.value;
      set((state) => ({ ...state, shipping_group_name: newGroupName }));
    },
    setShippingCalculType: (type: ShippingCalculType) => {
      set((state) => ({ ...state, shipping_calcul_type: type }));
    },
    clearShippingAdditionalSetting: () => {
      set((state) => ({
        ...state,
        shipping_std_free_yn: 'N',
        shipping_add_free_yn: 'N',
        shipping_calcul_free_yn: 'N',
      }));
    },
    setShippingStdFree: (e: React.ChangeEvent<HTMLInputElement>) => {
      const { shipping_add_free_yn } = get();
      set((state) => ({
        ...state,
        shipping_std_free_yn: e.currentTarget.checked ? 'Y' : 'N',
        shipping_calcul_free_yn:
          shipping_add_free_yn === 'Y' || e.currentTarget.checked ? 'Y' : 'N',
      }));
    },
    setShippingAddFree: (e: React.ChangeEvent<HTMLInputElement>) => {
      const { shipping_std_free_yn } = get();
      set((state) => ({
        ...state,
        shipping_add_free_yn: e.currentTarget.checked ? 'Y' : 'N',
        shipping_calcul_free_yn:
          shipping_std_free_yn === 'Y' || e.currentTarget.checked ? 'Y' : 'N',
      }));
    },
    setAddress: (postalCode: string, baseAddress: string) => {
      set((state) => ({
        ...state,
        postalCode,
        baseAddress,
      }));
    },
    setDetailAddress: (e: React.ChangeEvent<HTMLInputElement>) => {
      set((state) => ({
        ...state,
        detailAddress: e.currentTarget.value,
      }));
    },
    addShippingSet: (item: ShippingSetDto) => {
      const { shippingSets } = get();
      const tempId = shippingSets.length
        ? shippingSets[shippingSets.length - 1].tempId + 1
        : 0;
      set((state) => ({
        ...state,
        shippingSets: [...shippingSets, { ...item, tempId }],
      }));
    },
    removeShippingSet: (id: number) => {
      const { shippingSets } = get();
      const filtered = shippingSets.filter((item) => item.tempId !== id);
      set((state) => ({
        ...state,
        shippingSets: filtered,
      }));
    },
  }),
);
