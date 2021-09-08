/* eslint-disable @typescript-eslint/no-empty-function */
import { ShippingCalculType, ShippingPolicyFormData } from '@project-lc/shared-types';
import create from 'zustand';

export interface ShippingGroupItemStoreState extends ShippingPolicyFormData {
  data: ShippingPolicyFormData;
  setGroupName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShippingCalculType: (type: ShippingCalculType) => void;
  clearShippingAdditionalSetting: () => void;
  setShippingStdFree: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShippingAddFree: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setAddress: (postalCode: string, baseAddress: string) => void;
  setDetailAddress: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addShippingSet: () => void;
  removeShippingSet: (id: number) => void;
}
export const useShippingGroupItemStore = create<ShippingGroupItemStoreState>(
  (set, get) => ({
    get data() {
      const {
        groupName,
        shippingCalculType,
        shippingStdFree,
        shippingAddFree,
        postalCode,
        baseAddress,
        detailAddress,
        shippingSets,
      } = get();
      return {
        groupName,
        shippingCalculType,
        shippingStdFree,
        shippingAddFree,
        postalCode,
        baseAddress,
        detailAddress,
        shippingSets,
      };
    },
    groupName: '',
    shippingCalculType: 'bundle',
    shippingStdFree: false,
    shippingAddFree: false,
    postalCode: '',
    baseAddress: '',
    detailAddress: '',
    shippingSets: [],
    setGroupName: (e: React.ChangeEvent<HTMLInputElement>) => {
      const newGroupName = e.currentTarget.value;
      set((state) => ({ ...state, groupName: newGroupName }));
    },
    setShippingCalculType: (type: ShippingCalculType) => {
      set((state) => ({ ...state, shippingCalculType: type }));
    },
    clearShippingAdditionalSetting: () => {
      set((state) => ({
        ...state,
        shippingStdFree: false,
        shippingAddFree: false,
      }));
    },
    setShippingStdFree: (e: React.ChangeEvent<HTMLInputElement>) => {
      set((state) => ({
        ...state,
        shippingStdFree: e.currentTarget.checked,
      }));
    },
    setShippingAddFree: (e: React.ChangeEvent<HTMLInputElement>) => {
      set((state) => ({
        ...state,
        shippingAddFree: e.currentTarget.checked,
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
    addShippingSet: () => {},
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
