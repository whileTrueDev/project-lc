import create from 'zustand';

export interface SearchPopoverStore {
  isOpen: boolean;
  handlePopover: (value: boolean) => void;
}

export const useSearchPopoverStore = create<SearchPopoverStore>((set, get) => ({
  isOpen: false,
  handlePopover: (value) => {
    return set({ isOpen: value });
  },
}));
