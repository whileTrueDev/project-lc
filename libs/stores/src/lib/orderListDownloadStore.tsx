import dayjs from 'dayjs';
import create from 'zustand';

interface OrderListDownloadStoreStates {
  disableHeaders: string[];
  toggleDisableHeaders: (h: string) => void;
  fileName: string;
  setFileName: (fileName: string) => void;
}

const now = dayjs().format('YY/MM/DD');
export const ORDER_DOWNLOAD_DEFAULT_FILENAME = `크크쇼주문목록_${now}`;
export const useOrderListDownloadStore = create<OrderListDownloadStoreStates>(
  (set, get) => ({
    fileName: ORDER_DOWNLOAD_DEFAULT_FILENAME,
    setFileName: (f) => {
      set({ fileName: f });
    },
    disableHeaders: [],
    toggleDisableHeaders: (disableHeader: string) => {
      const state = get();
      const isInclude = state.disableHeaders.includes(disableHeader);
      if (isInclude) {
        set((prev) => {
          return {
            disableHeaders: prev.disableHeaders.filter((h) => h !== disableHeader),
          };
        });
      } else {
        set((prev) => {
          return { disableHeaders: prev.disableHeaders.concat(disableHeader) };
        });
      }
    },
  }),
);
