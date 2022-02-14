import { Broadcaster, BroadcasterPromotionPage } from '@prisma/client';

export type BroadcasterPromotionPageData = BroadcasterPromotionPage & {
  broadcaster: Pick<Broadcaster, 'userNickname' | 'email'>;
};
export type BroadcasterPromotionPageListRes = BroadcasterPromotionPageData[];
