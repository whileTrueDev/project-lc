import { PurchaseMessage } from '../overlay/overlay-types';

export interface PurchaseMessageWithLoginFlag extends Omit<PurchaseMessage, 'roomName'> {
  userId: string;
  loginFlag: boolean;
  giftFlag: boolean;
  phoneCallEventFlag: boolean;
}
