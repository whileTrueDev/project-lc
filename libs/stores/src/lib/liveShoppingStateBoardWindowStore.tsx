import create from 'zustand';

export interface LiveShoppingStateBoardWindowStore {
  _window: Window | null;
  openWindow: (url: string, target: string, features: string) => void;
  closeWindow: () => void;
}

export const liveShoppingStateBoardWindowStore =
  create<LiveShoppingStateBoardWindowStore>((set, get) => ({
    _window: null,
    openWindow: (url: string, target: string, features: string) => {
      const { _window } = get();
      if (_window) {
        _window.location.href = url;
        _window.focus();
      } else {
        const w = window.open(url, target, features);
        if (w) set((state) => ({ ...state, _window: w }));
      }
    },
    closeWindow: () => {
      const { _window } = get();
      if (_window) _window.close();
    },
  }));
