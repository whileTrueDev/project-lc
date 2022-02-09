import { Broadcaster, BroadcasterPromotionPage } from '@prisma/client';

export type BroadcasterPromotionPageData = BroadcasterPromotionPage & {
  broadcaster: Pick<Broadcaster, 'userName' | 'email'>;
};
export type BroadcasterPromotionPageListRes = BroadcasterPromotionPageData[];
