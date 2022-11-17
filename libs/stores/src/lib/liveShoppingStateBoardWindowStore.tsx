import create from 'zustand';

export interface LiveShoppingStateBoardWindowStore {
  _window: Window | null;
  openWindow: (url: string, target: string, features: string) => void;
  closeWindow: () => void;
}

/** 방송인센터 현황판 윈도우 객체 상태 관리 */
export const liveShoppingStateBoardWindowStore =
  create<LiveShoppingStateBoardWindowStore>((set, get) => ({
    _window: null,
    openWindow: (url: string, target: string, features: string) => {
      const { _window } = get();
      if (_window && !_window.closed) {
        // 윈도우 객체가 존재하고 열려있는 경우
        _window.focus();
      } else {
        // 윈도우 객체가 없거나, 객체는 있지만 닫힌 경우(x 버튼 눌러서 현황창 닫는경우 _window 객체는 존재하나 _window내부 값이 null이 된 경우)
        // 새 윈도우 객체로 바꾼다
        const w = window.open(url, target, features);
        if (w) set((state) => ({ ...state, _window: w }));
      }
    },
    closeWindow: () => {
      const { _window } = get();
      if (_window) {
        _window.close();
        set((state) => ({ ...state, _window: null }));
      }
    },
  }));
