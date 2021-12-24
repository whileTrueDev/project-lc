export interface OverlayControllerMainRes {
  userIdAndUrlAndNicknames: {
    email: string;
    userNickname: string;
    overlayUrl: string;
  }[];
  OVERLAY_CONTROLLER_HOST: string;
  OVERLAY_HOST: string;
  liveShoppings: {
    id: number;
    broadcaster: {
      email: string;
      userNickname: string;
      overlayUrl: string;
    };
  };
}
