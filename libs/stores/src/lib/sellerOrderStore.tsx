import create from 'zustand';
import { GridRowId, GridSelectionModel } from '@material-ui/data-grid';
import { OrderProcessStep } from '@prisma/client';
import { GetOrderListDto } from '@project-lc/shared-types';

export interface SellerOrderFilterFormType {
  search: string;
  searchDateType: '주문일' | '입금일';
  searchStartDate: string | null; // this way is not supported https://github.com/react-hook-form/react-hook-form/issues/4704
  searchEndDate: string | null; // this way is not supported https://github.com/react-hook-form/react-hook-form/issues/4704
  searchStatuses: OrderProcessStep[];
}

export interface SellerOrderStoreState extends GetOrderListDto {
  handleOrderSearchStates(dto: SellerOrderFilterFormType): void;
  selectedOrders: GridRowId[];
  handleOrderSelected: (s: GridSelectionModel) => void;
}
export const useSellerOrderStore = create<SellerOrderStoreState>((set, get) => ({
  search: '',
  searchDateType: '주문일',
  searchStartDate: null,
  searchEndDate: null,
  searchStatuses: [],
  handleOrderSearchStates(dto: SellerOrderFilterFormType) {
    set({
      search: dto.search,
      searchDateType: dto.searchDateType,
      periodStart: dto.searchStartDate || undefined,
      periodEnd: dto.searchEndDate || undefined,
      searchStatuses: dto.searchStatuses,
    });
  },

  selectedOrders: [],
  handleOrderSelected(s: GridSelectionModel) {
    set({ selectedOrders: s });
  },
}));
