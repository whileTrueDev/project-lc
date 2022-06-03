import create from 'zustand';
import { GridRowData } from '@material-ui/data-grid';

export interface AdminBroadcasterListStore {
  broadcasterDetail: GridRowData | null;
  setBroadcasterDetail: (data: GridRowData) => void;
}

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

export const adminCustomerListStore = create<AdminCustomerListStore>((set) => ({
  customerDetail: null,
  setCustomerDetail: (value) => {
    set((state) => ({
      ...state,
      customerDetail: value,
    }));
  },
}));
