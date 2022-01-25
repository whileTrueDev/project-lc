export type AdminMessage = {
  text: string;
  liveShoppingId: number;
};

export interface LiveShoppingStateServerToClientEvents {
  subscribed: (data: any) => void;
  adminMessageCreated: (data: AdminMessage) => void;
  adminAlertCreated: () => void;
  purchaseMessageUpdated: () => void;
}

export interface LiveShoppingStateClientToServerEvents {
  subscribe: (liveShoppingId: number) => void;
  createAdminMessage: (data: AdminMessage) => void;
  createAdminAlert: (liveShoppingId: number) => void;
  updatePurchaseMessage: (liveShoppingId: number) => void;
}
