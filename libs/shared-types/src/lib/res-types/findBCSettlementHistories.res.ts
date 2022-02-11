import {
  BroadcasterSettlements,
  BroadcasterSettlementItems,
  LiveShopping,
  Broadcaster,
  ProductPromotion,
} from '@prisma/client';

export type FindBcSettlementHistoriesRes = Array<
  BroadcasterSettlements & {
    broadcasterSettlementItems: Array<
      BroadcasterSettlementItems & {
        liveShopping: LiveShopping;
        productPromotion: ProductPromotion;
      }
    >;
    broadcaster: Pick<Broadcaster, 'id' | 'userNickname'>;
  }
>;
