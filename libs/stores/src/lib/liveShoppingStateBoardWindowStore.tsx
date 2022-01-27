import create from 'zustand';

export interface LiveShoppingStateBoardWindowStore {
  windows: Window[];
  addWindow: (w: Window) => void;
  closeWindows: () => void;
}

export const liveShoppingStateBoardWindowStore =
  create<LiveShoppingStateBoardWindowStore>((set, get) => ({
    windows: [],
    addWindow: (w: Window) => {
      set((state) => ({
        ...state,
        windows: [...state.windows, w],
      }));
    },
    closeWindows: () => {
      const { windows } = get();
      windows.forEach((w) => w.close());
    },
  }));
