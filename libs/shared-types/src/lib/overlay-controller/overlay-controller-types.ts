import { PurchaseMessage } from '../overlay/overlay-types';

export interface PurchaseMessageWithLoginFlag extends Omit<PurchaseMessage, 'roomName'> {
  /** broadcaster email */
  email: string;
  /** 메세지 작성자 로그인 여부 */
  loginFlag: boolean;
  /** 메세지 작성자 스트리머에게 선물하기 여부 */
  giftFlag: boolean;
  /** 메세지 작성자 전화 이벤트 참여 여부 */
  phoneCallEventFlag: boolean;
  /** 라이브쇼핑 ID */
  liveShoppingId: number;
}
