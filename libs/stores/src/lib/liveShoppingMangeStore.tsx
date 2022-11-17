import create from 'zustand';

export interface LiveShoppingManageStore {
  selectedBroadcaster: string | null;
  handleBroadcasterSelect(value: string | null): void;
}

/** 라이브쇼핑에 연결될 방송인 상태 관리 */
export const liveShoppingManageStore = create<LiveShoppingManageStore>((set) => ({
  selectedBroadcaster: null,
  handleBroadcasterSelect: (value: string | null) => {
    set((state) => ({
      ...state,
      selectedBroadcaster: value,
    }));
  },
}));
