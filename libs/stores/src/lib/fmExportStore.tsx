import create from 'zustand';

export interface FmExportStoreStates {
  selectedOrderShippings: number[];
  handleOrderShippingSelect: (shippingSeq: number, forceConcat?: 'forceConcat') => void;
  resetSelectedOrderShippings: () => void;
}

export const fmExportStore = create<FmExportStoreStates>((set, get) => ({
  selectedOrderShippings: [],
  handleOrderShippingSelect: (shippingSeq, forceConcat) => {
    return set(({ selectedOrderShippings }) => {
      if (selectedOrderShippings.includes(shippingSeq)) {
        if (forceConcat) return { selectedOrderShippings };
        return {
          selectedOrderShippings: selectedOrderShippings.filter((o) => o !== shippingSeq),
        };
      }
      return { selectedOrderShippings: selectedOrderShippings.concat(shippingSeq) };
    });
  },
  resetSelectedOrderShippings: () => {
    return set({ selectedOrderShippings: [] });
  },
}));
