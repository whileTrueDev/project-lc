import create from 'zustand';

export type KkshowSearchStore = SearchKeywordStore & SearchDrawerStore;

export interface SearchKeywordStore {
  keywords: string[];
  appendKeyword: (value: string) => void;
  setKeywords(keywords: string[]): void;
  loadKeywords: () => void;
  deleteKeyword: (value: string) => void;
}

export interface SearchDrawerStore {
  isSearchDrawerOpen: boolean;
  openSearchDrawer: () => void;
  closeSearchDrawer: () => void;
}

export const KEYWORD_KEY = 'recentSearchKeyword';

/** 크크쇼 검색 상태 관리 */
export const useKkshowSearchStore = create<KkshowSearchStore>((set) => ({
  // 검색어
  keywords: [],
  appendKeyword: (newKeyword: string) => {
    const MAX_RECENT_KEYWORD = 5;
    const storedKeywords = window.localStorage.getItem(KEYWORD_KEY);

    let _newKeywords: string[] = JSON.parse(storedKeywords || '[]');
    _newKeywords.unshift(newKeyword);
    _newKeywords = [...new Set(_newKeywords)];
    if (_newKeywords.length > MAX_RECENT_KEYWORD)
      _newKeywords = _newKeywords.splice(0, MAX_RECENT_KEYWORD);

    const newKeywordsString = JSON.stringify(_newKeywords);
    window.localStorage.setItem(KEYWORD_KEY, newKeywordsString);

    set({ keywords: _newKeywords });
  },
  setKeywords: (keywords: string[]) => {
    set({ keywords });
  },
  loadKeywords: () =>
    set({
      keywords: JSON.parse(window.localStorage.getItem(KEYWORD_KEY) || '[]'),
    }),

  deleteKeyword: (targetKeyword: string) => {
    const storedKeywords = window.localStorage.getItem(KEYWORD_KEY);
    const keywords: string[] = JSON.parse(storedKeywords || '[]');
    const index = keywords.indexOf(targetKeyword);
    if (index !== -1) {
      keywords.splice(index, 1);
      window.localStorage.setItem(KEYWORD_KEY, JSON.stringify(keywords));
      set({ keywords: JSON.parse(window.localStorage.getItem(KEYWORD_KEY) || '[]') });
    }
  },
  // 모바일 검색 drawer 창
  isSearchDrawerOpen: false,
  openSearchDrawer: () => set({ isSearchDrawerOpen: true }),
  closeSearchDrawer: () => set({ isSearchDrawerOpen: false }),
}));
