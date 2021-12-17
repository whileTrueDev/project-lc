import {
  BroadcasterSettlements,
  BroadcasterSettlementItems,
  LiveShopping,
  Broadcaster,
} from '@prisma/client';

export type FindBcSettlementHistoriesRes = Array<
  BroadcasterSettlements & {
    broadcasterSettlementItems: Array<
      BroadcasterSettlementItems & { liveShopping: LiveShopping }
    >;
    broadcaster: Pick<Broadcaster, 'id' | 'userNickname'>;
  }
>;
