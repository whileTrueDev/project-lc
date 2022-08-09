import { Return } from '@prisma/client';
import create from 'zustand';

export interface AdminReturnFilterData {
  searchDateType: keyof Return;
  searchStartDate?: string | Date;
  searchEndDate?: string | Date;
}

export interface AdminReturnFilterStore extends AdminReturnFilterData {
  setReturnFilter: (data: AdminReturnFilterData) => void;
}

export const useAdminReturnFilterStore = create<AdminReturnFilterStore>((set) => ({
  searchDateType: 'requestDate', // '환불요청일'
  searchStartDate: undefined,
  searchEndDate: undefined,
  setReturnFilter: (data) => {
    set({ ...data });
  },
}));
