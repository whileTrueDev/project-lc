import {
  SellerGoodsSortColumn,
  SellerGoodsSortDirection,
} from '@project-lc/shared-types';
import create from 'zustand';

export interface SellerGoodsListPanelStoreState {
  page: number;
  itemPerPage: number;
  sort: SellerGoodsSortColumn;
  direction: SellerGoodsSortDirection;
  groupId?: number;
  setGroupId(groupId: number): void;
  changePage(page: number): void;
  changeItemPerPage(itemPerPage: number): void;
  changeSort(sort: SellerGoodsSortColumn, direction: SellerGoodsSortDirection): void;
  handlePageSizeChange(event: React.ChangeEvent<HTMLSelectElement>): void;
  handleSortChange(event: React.ChangeEvent<HTMLSelectElement>): void;
}

/** 상품목록 조회 상태 관리 */
export const useSellerGoodsListPanelStore = create<SellerGoodsListPanelStoreState>(
  (set, get) => ({
    page: 0,
    itemPerPage: 10,
    sort: SellerGoodsSortColumn.REGIST_DATE,
    direction: SellerGoodsSortDirection.DESC,
    setGroupId: (groupId: number) => set((state) => ({ ...state, groupId })),
    changePage: (page: number) => set((state) => ({ ...state, page })),
    changeItemPerPage: (itemPerPage: number) =>
      set((state) => ({ ...state, itemPerPage })),
    changeSort: (sort: SellerGoodsSortColumn, direction: SellerGoodsSortDirection) =>
      set((state) => ({ ...state, sort, direction })),
    handlePageSizeChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      set((state) => ({ ...state, page: 0, itemPerPage: Number(value) }));
    },
    handleSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      switch (value) {
        case 'regist_date':
          set((state) => ({
            ...state,
            sort: SellerGoodsSortColumn.REGIST_DATE,
            direction: SellerGoodsSortDirection.DESC,
          }));
          break;
        case 'goods_name':
          set((state) => ({
            ...state,
            sort: SellerGoodsSortColumn.GOODS_NAME,
            direction: SellerGoodsSortDirection.DESC,
          }));
          break;
        default:
      }
    },
  }),
);
