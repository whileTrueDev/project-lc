export interface OverlayControllerMainRes {
  userIdAndUrlAndNicknames: {
    email: string;
    userNickname: string;
    overlayUrl: string;
  }[];
  HOST: string;
  SOCKET_HOST: string;
  liveShoppings: {
    id: number;
    broadcaster: {
      email: string;
      userNickname: string;
      overlayUrl: string;
    };
  };
}
