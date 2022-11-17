import { AdminReturnListDto } from '@project-lc/shared-types';
import create from 'zustand';

export interface AdminReturnFilterStore extends AdminReturnListDto {
  setReturnFilter: (data: AdminReturnListDto) => void;
}

/** 관리자 환불요청 필터 상태 관리 */
export const useAdminReturnFilterStore = create<AdminReturnFilterStore>((set) => ({
  searchDateType: 'requestDate', // '환불요청일'
  searchStartDate: undefined,
  searchEndDate: undefined,
  setReturnFilter: (data) => {
    set({ ...data });
  },
}));
