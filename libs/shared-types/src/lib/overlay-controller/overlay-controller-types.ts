import { PurchaseMessage } from '@project-lc/shared-types';

export interface PurchaseMessageWithLoginFlag extends Omit<PurchaseMessage, 'roomName'> {
  loginFlag: boolean;
}
