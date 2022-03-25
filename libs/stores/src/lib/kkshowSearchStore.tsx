import create from 'zustand';

export interface kkshowSearch {
  keyword: string;
  setKeyword(value: string): void;
}

export const useKkshowSearchStore = create<kkshowSearch>((set, get) => ({
  keyword: '',
  setKeyword: (value: string) => {
    set(() => ({
      keyword: value,
    }));
  },
}));
