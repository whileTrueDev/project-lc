import { BroadcasterSettlements, BroadcasterSettlementItems } from '@prisma/client';

export type FindBCSettlementHistoriesRes = Array<
  BroadcasterSettlements & {
    broadcasterSettlementItems: Array<BroadcasterSettlementItems>;
  }
>;
