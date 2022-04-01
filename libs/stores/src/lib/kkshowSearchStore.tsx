import create from 'zustand';

export interface kkshowSearch {
  keyword: string;
  localStorage: string[];
  setKeyword(value: string): void;
  setLocalStorage(value: string[]): void;
}

export interface searchDrawer {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export interface SearchPopoverStore {
  isOpen: boolean;
  handlePopover: (value: boolean) => void;
}

export const useKkshowSearchStore = create<kkshowSearch>((set, get) => ({
  keyword: '',
  localStorage: [],
  setKeyword: (value: string) => {
    set(() => ({
      keyword: value,
    }));
  },
  setLocalStorage: (value: string[]) => {
    set(() => ({
      localStorage: value,
    }));
  },
}));

export const useSearchDrawer = create<searchDrawer>((set, get) => ({
  isOpen: false,
  setIsOpen: (value: boolean) => {
    set(() => ({
      isOpen: value,
    }));
  },
}));

export const useSearchPopoverStore = create<SearchPopoverStore>((set, get) => ({
  isOpen: false,
  handlePopover: (value) => {
    return set({ isOpen: value });
  },
}));
