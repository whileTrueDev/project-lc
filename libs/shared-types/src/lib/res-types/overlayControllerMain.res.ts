export interface OverlayControllerMainRes {
  userIdAndUrlAndNicknames: {
    email: string;
    userNickname: string;
    overlayUrl: string;
  }[];
  HOST: any;
  liveShoppings: {
    id: number;
    broadcaster: {
      email: string;
      userNickname: string;
      overlayUrl: string;
    };
  };
}
