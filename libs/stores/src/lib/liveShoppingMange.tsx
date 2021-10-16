import create from 'zustand';

export interface LiveShoppingManage {
  selectedProgress: string | null;
  selectedBroadcaster: string | null;
  selectedStartDate: string | null;
  selectedEndDate: string | null;
  handleProgressSelect(value: string): void;
  handleBroadcasterSelect(value: string | null): void;
  handleStartDateSelect(value: string): void;
  handleEndDateSelect(value: string): void;
}

export const liveShoppingManage = create<LiveShoppingManage>((set) => ({
  selectedProgress: null,
  selectedBroadcaster: null,
  selectedStartDate: null,
  selectedEndDate: null,
  handleProgressSelect: (value: string) => {
    set((state) => ({
      ...state,
      selectedGoods: value,
    }));
  },
  handleBroadcasterSelect: (value: string | null) => {
    set((state) => ({
      ...state,
      setDefault: value,
    }));
  },
  handleStartDateSelect: (value: string) => {
    set((state) => ({
      ...state,
      setDefault: value,
    }));
  },
  handleEndDateSelect: (value: string) => {
    set((state) => ({
      ...state,
      setDefault: value,
    }));
  },
}));
