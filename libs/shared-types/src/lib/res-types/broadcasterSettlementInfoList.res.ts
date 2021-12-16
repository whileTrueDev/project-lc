import {
  Broadcaster,
  BroadcasterSettlementInfo,
  BroadcasterSettlementInfoConfirmation,
} from '@prisma/client';

export type BroadcasterSettlementInfoListRes = Omit<
  BroadcasterSettlementInfo,
  'taxManageAgreement' | 'personalInfoAgreement' | 'settlementAgreement'
> & {
  confirmation: BroadcasterSettlementInfoConfirmation;
  broadcaster: Pick<Broadcaster, 'email' | 'userNickname'>;
};

export type AdminBroadcasterSettlementInfoList = BroadcasterSettlementInfoListRes[];
