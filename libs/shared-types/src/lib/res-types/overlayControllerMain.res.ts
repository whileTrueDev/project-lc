import { LiveShoppingsWithBroadcasterAndGoodsName } from '../dto/liveShopping.dto';

export interface OverlayControllerMainRes {
  userIdAndUrlAndNicknames: {
    email: string;
    userNickname: string;
    overlayUrl: string;
  }[];
  OVERLAY_CONTROLLER_HOST: string;
  OVERLAY_HOST: string;
  liveShoppings: LiveShoppingsWithBroadcasterAndGoodsName[];
  REALTIME_API_HOST?: string;
}
