import create from 'zustand';

type SellerExportShippingItem = { shippingId: number; orderId: number };
export interface SellerExportStore {
  selectedOrderShippings: SellerExportShippingItem[];
  handleOrderShippingSelect: (
    shippingItem: SellerExportShippingItem,
    forceConcat?: 'forceConcat',
  ) => void;
  resetSelectedOrderShippings: () => void;
}

/** 출고 위한 배송비정보 상태 관리 */
export const sellerExportStore = create<SellerExportStore>((set, get) => ({
  selectedOrderShippings: [],
  handleOrderShippingSelect: ({ shippingId, orderId }, forceConcat) => {
    return set(({ selectedOrderShippings }) => {
      if (selectedOrderShippings.find((x) => x.shippingId === shippingId)) {
        if (forceConcat) return { selectedOrderShippings };
        return {
          selectedOrderShippings: selectedOrderShippings.filter(
            (o) => o.shippingId !== shippingId,
          ),
        };
      }
      return {
        selectedOrderShippings: selectedOrderShippings.concat([{ shippingId, orderId }]),
      };
    });
  },
  resetSelectedOrderShippings: () => {
    return set({ selectedOrderShippings: [] });
  },
}));
