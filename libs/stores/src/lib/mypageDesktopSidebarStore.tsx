import create from 'zustand';

export interface MypageDesktopSidebarStore {
  isOpen: boolean;
  onToggle: () => void;
}

/** 마이페이지 사이드바 열림상태 관리 */
export const mypageDesktopSidebarStore = create<MypageDesktopSidebarStore>(
  (set, get) => ({
    isOpen: true,
    onToggle: () => {
      const target = !get().isOpen;
      set({ isOpen: target });
    },
  }),
);
