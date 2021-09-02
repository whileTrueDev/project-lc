import { SortColumn, SortDirection } from '@project-lc/shared-types';
import create from 'zustand';

export interface SellerGoodsListPanelStoreState {
  page: number;
  itemPerPage: number;
  sort: SortColumn;
  direction: SortDirection;
  changePage(page: number): void;
  changeItemPerPage(itemPerPage: number): void;
  changeSort(sort: SortColumn, direction: SortDirection): void;
  handlePageSizeChange(event: React.ChangeEvent<HTMLSelectElement>): void;
  handleSortChange(event: React.ChangeEvent<HTMLSelectElement>): void;
}

export const useSellerGoodsListPanelStore = create<SellerGoodsListPanelStoreState>(
  (set, get) => ({
    page: 0,
    itemPerPage: 10,
    sort: SortColumn.REGIST_DATE,
    direction: SortDirection.DESC,
    changePage: (page: number) => set((state) => ({ ...state, page })),
    changeItemPerPage: (itemPerPage: number) =>
      set((state) => ({ ...state, itemPerPage })),
    changeSort: (sort: SortColumn, direction: SortDirection) =>
      set((state) => ({ ...state, sort, direction })),
    handlePageSizeChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      set((state) => ({ ...state, page: 0, itemPerPage: Number(value) }));
    },
    handleSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      console.log(value);
      switch (value) {
        case 'regist_date':
          set((state) => ({
            ...state,
            sort: SortColumn.REGIST_DATE,
            direction: SortDirection.DESC,
          }));
          break;
        case 'goods_name':
          set((state) => ({
            ...state,
            sort: SortColumn.GOODS_NAME,
            direction: SortDirection.DESC,
          }));
          break;
        default:
      }
    },
  }),
);
