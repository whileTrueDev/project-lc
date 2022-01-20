import create from 'zustand';

export interface MypageDesktopSidebarStore {
  isOpen: boolean;
  onToggle: () => void;
}

export const mypageDesktopSidebarStore = create<MypageDesktopSidebarStore>(
  (set, get) => ({
    isOpen: true,
    onToggle: () => {
      const target = !get().isOpen;
      set({ isOpen: target });
    },
  }),
);
