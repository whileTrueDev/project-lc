import create from 'zustand';
import { GridRowId, GridSelectionModel } from '@material-ui/data-grid';
import { FindFmOrdersDto, OrderFilterFormType } from '@project-lc/shared-types';

export interface FmOrderStoreState extends FindFmOrdersDto {
  handleOrderSearchStates(dto: OrderFilterFormType): void;
  selectedOrders: GridRowId[];
  handleOrderSelected: (s: GridSelectionModel) => void;
}

export const useFmOrderStore = create<FmOrderStoreState>((set, get) => ({
  search: '',
  searchDateType: '주문일',
  searchStartDate: null,
  searchEndDate: null,
  searchStatuses: [],
  handleOrderSearchStates(dto: OrderFilterFormType) {
    set({
      search: dto.search,
      searchDateType: dto.searchDateType,
      searchStartDate: dto.searchStartDate || undefined,
      searchEndDate: dto.searchEndDate || undefined,
      searchStatuses: dto.searchStatuses,
    });
  },

  selectedOrders: [],
  handleOrderSelected(s: GridSelectionModel) {
    set({ selectedOrders: s });
  },
}));
