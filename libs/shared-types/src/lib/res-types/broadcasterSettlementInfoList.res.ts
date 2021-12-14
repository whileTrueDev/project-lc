import {
  Broadcaster,
  BroadcasterSettlementInfo,
  BroadcasterSettlementInfoConfirmation,
} from '@prisma/client';

export type BroadcasterSettlementInfoListRes = Omit<
  BroadcasterSettlementInfo,
  'taxManageAgreement' | 'personalInfoAgreement' | 'settlementAgreement'
> &
  BroadcasterSettlementInfoConfirmation &
  Pick<Broadcaster, 'email' | 'userNickname'>;
