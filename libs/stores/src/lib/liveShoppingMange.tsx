import create from 'zustand';

export interface LiveShoppingManage {
  selectedBroadcaster: string | null;
  handleBroadcasterSelect(value: string | null): void;
}

export const liveShoppingManage = create<LiveShoppingManage>((set) => ({
  selectedBroadcaster: null,
  handleBroadcasterSelect: (value: string | null) => {
    set((state) => ({
      ...state,
      selectedBroadcaster: value,
    }));
  },
}));
