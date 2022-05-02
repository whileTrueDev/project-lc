import { Customer } from '@prisma/client';

/** 소비자 마이페이지 홈에서 표시될 정보 */
export type CustomerStatusRes = {
  id: Customer['id'];
  /** 닉네임 */
  nickname?: Customer['nickname'];
  /** 팔로잉 */
  followingBroadcasters: number;
  /** 라이브알림 */
  followingLiveShoppings: number;
  /** 배송중 */
  shippingOrders: number;
};
