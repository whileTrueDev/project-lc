import create from 'zustand';
import { OrderFilterFormType } from '@project-lc/components';
import { FindFmOrdersDto } from '../../../shared-types/src';

export interface FmOrderStoreState extends FindFmOrdersDto {
  handleOrderSearchStates(dto: OrderFilterFormType): void;
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
}));
