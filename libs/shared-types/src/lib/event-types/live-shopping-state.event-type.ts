export type AdminMessage = {
  text: string;
  liveShoppingId: number;
};

export interface LiveShoppingStateServerToClientEvents {
  subscribed: (data: any) => void;
  adminMessageCreated: (data: AdminMessage) => void;
  adminAlertCreated: () => void;
  purchaseMessageUpdated: () => void;
  playOutro: (roomName?: string) => void;
}

/** LiveShoppingStateGateway 에서 구독하는 메시지(@SubscribeMessage) 타입 */
export interface LiveShoppingStateServerSubscribeEvents
  extends LiveShoppingStateBoardToServerEvents,
    OverlayControllerToServerEvents {}

/** 현황판에서 emit */
export interface LiveShoppingStateBoardToServerEvents {
  subscribe: (liveShoppingId: number) => void;
  requestOutroPlay: (roomName?: string) => void;
}

/** 오버레이 컨트롤러에서 emit */
export interface OverlayControllerToServerEvents {
  createAdminMessage: (data: AdminMessage) => void;
  createAdminAlert: (liveShoppingId: number) => void;
  updatePurchaseMessage: (liveShoppingId: number) => void;
}
