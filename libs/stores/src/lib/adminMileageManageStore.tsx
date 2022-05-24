import create from 'zustand';
import { CustomerMileage } from '@prisma/client';
import { GridRowData } from '@material-ui/data-grid';

export interface AdminMileageManageStore {
  mileage: GridRowData | null;
  mileageLog: GridRowData | null;
  setMileageDetail: (data: GridRowData) => void;
  setMileageLogDetail: (data: GridRowData) => void;
}

export const adminMileageManageStore = create<AdminMileageManageStore>((set) => ({
  mileage: null,
  mileageLog: null,
  setMileageDetail: (value) => {
    set((state) => ({
      ...state,
      mileage: value,
    }));
  },
  setMileageLogDetail: (value) => {
    set((state) => ({
      ...state,
      mileageLog: value,
    }));
  },
}));
