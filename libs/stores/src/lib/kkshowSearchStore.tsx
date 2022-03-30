import create from 'zustand';

export interface kkshowSearch {
  keyword: string;
  localStorage: string[];
  setKeyword(value: string): void;
  setLocalStorage(value: string[]): void;
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
