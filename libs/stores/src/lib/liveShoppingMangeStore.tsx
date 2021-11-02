import create from 'zustand';

export interface LiveShoppingManageStore {
  selectedBroadcaster: string | null;
  handleBroadcasterSelect(value: string | null): void;
}

export const liveShoppingManageStore = create<LiveShoppingManageStore>((set) => ({
  selectedBroadcaster: null,
  handleBroadcasterSelect: (value: string | null) => {
    set((state) => ({
      ...state,
      selectedBroadcaster: value,
    }));
  },
}));
