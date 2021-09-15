import create from 'zustand';

export interface FmExportStoreStates {
  selectedOptions: string[];
  handleOptionSelect: (optId: string, forceConcat?: 'forceConcat') => void;
  resetSelectedOptions: () => void;
}

export const fmExportStore = create<FmExportStoreStates>((set, get) => ({
  selectedOptions: [],
  handleOptionSelect: (optId, forceConcat) => {
    return set(({ selectedOptions }) => {
      if (selectedOptions.includes(optId)) {
        if (forceConcat) return { selectedOptions };
        return { selectedOptions: selectedOptions.filter((o) => o !== optId) };
      }
      return { selectedOptions: selectedOptions.concat(optId) };
    });
  },
  resetSelectedOptions: () => {
    return set({ selectedOptions: [] });
  },
}));
