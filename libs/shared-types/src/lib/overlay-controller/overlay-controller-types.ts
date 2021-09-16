import { PurchaseMessage } from '@project-lc/shared-types';

export interface PurchaseMessageWithLoginFlag extends Omit<PurchaseMessage, 'roomName'> {
  userId: string;
  loginFlag: boolean;
  giftFlag: boolean;
  phoneCallEventFlag: boolean;
}
