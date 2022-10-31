import dayjs from 'dayjs';
import create from 'zustand';

interface OrderListDownloadStoreStates {
  disableHeaders: string[];
  toggleDisableHeaders: (h: string) => void;
  fileName: string;
  setFileName: (fileName: string) => void;
}

export const getOrderDownloadFileName = (): string => {
  const now = dayjs().format('YY/MM/DD');
  const ORDER_DOWNLOAD_DEFAULT_FILENAME = `크크쇼주문목록_${now}`;
  return ORDER_DOWNLOAD_DEFAULT_FILENAME;
};

/** 주문목록 다운로드 상태 관리 */
export const useOrderListDownloadStore = create<OrderListDownloadStoreStates>(
  (set, get) => ({
    fileName: getOrderDownloadFileName(),
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
