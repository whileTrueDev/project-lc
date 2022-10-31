import create from 'zustand';
import { GridRowData } from '@material-ui/data-grid';

export interface AdminBroadcasterListStore {
  broadcasterDetail: GridRowData | null;
  setBroadcasterDetail: (data: GridRowData) => void;
}

/** 관리자페이지에서 가입한 방송인 중 선택된 방송인의 상태 관리 */
export const adminBroadcasterListStore = create<AdminBroadcasterListStore>((set) => ({
  broadcasterDetail: null,
  setBroadcasterDetail: (value) => {
    set((state) => ({
      ...state,
      broadcasterDetail: value,
    }));
  },
}));

export interface AdminSellerListStore {
  sellerDetail: GridRowData | null;
  setSellerDetail: (data: GridRowData) => void;
}

/** 관리자페이지에서 가입한 판매자 중 선택된 판매자의 상태 관리 */
export const adminSellerListStore = create<AdminSellerListStore>((set) => ({
  sellerDetail: null,
  setSellerDetail: (value) => {
    set((state) => ({
      ...state,
      sellerDetail: value,
    }));
  },
}));

export interface AdminCustomerListStore {
  customerDetail: GridRowData | null;
  setCustomerDetail: (data: GridRowData) => void;
}
/** 관리자페이지에서 가입한 소비자 중 선택된 소비자의 상태 관리 */
export const adminCustomerListStore = create<AdminCustomerListStore>((set) => ({
  customerDetail: null,
  setCustomerDetail: (value) => {
    set((state) => ({
      ...state,
      customerDetail: value,
    }));
  },
}));
