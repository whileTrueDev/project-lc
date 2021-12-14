import {
  BroadcasterSettlementInfo,
  BroadcasterSettlementInfoConfirmation,
} from '.prisma/client';

export type BroadcasterSettlementInfoRes =
  | (BroadcasterSettlementInfo & {
      confirmation: BroadcasterSettlementInfoConfirmation;
    })
  | null;
