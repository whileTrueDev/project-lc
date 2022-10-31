import { GridSelectionModel } from '@material-ui/data-grid';
import { ExportListItem } from '@project-lc/shared-types';
import create from 'zustand';

export interface AdminOrderExportListStore {
  selectedItems: GridSelectionModel;
  onSelectedItemsChange: (newSelectedItems: GridSelectionModel) => void;
  selectedExports: ExportListItem[];
  setSelectedExports: (_selectedExports: ExportListItem[]) => void;
  resetSelectedExports: () => void;
}

/** 관리자 주문 내보내기 기능을 위한 상태 관리 */
export const useAdminOrderExportListStore = create<AdminOrderExportListStore>((set) => ({
  selectedItems: [],
  onSelectedItemsChange: (newV) => {
    set({ selectedItems: newV });
  },
  selectedExports: [],
  setSelectedExports: (selectedExports) => {
    set({ selectedExports });
  },
  resetSelectedExports: () => {
    set({ selectedExports: [], selectedItems: [] });
  },
}));
