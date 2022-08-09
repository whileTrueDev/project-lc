import { AdminReturnListDto } from '@project-lc/shared-types';
import create from 'zustand';

export interface AdminReturnFilterStore extends AdminReturnListDto {
  setReturnFilter: (data: AdminReturnListDto) => void;
}

export const useAdminReturnFilterStore = create<AdminReturnFilterStore>((set) => ({
  searchDateType: 'requestDate', // '환불요청일'
  searchStartDate: undefined,
  searchEndDate: undefined,
  setReturnFilter: (data) => {
    set({ ...data });
  },
}));
