import { Broadcaster, LiveShopping } from '@prisma/client';
import { FmExportItem, FmExport } from './fmExport.res';

export type ExportItemWithLiveShopping = FmExportItem & {
  liveShopping: LiveShopping & {
    broadcaster: Pick<
      Broadcaster,
      'email' | 'id' | 'userName' | 'userNickname' | 'avatar' | 'agreementFlag'
    >;
  };
};
export type BroadcasterSettlementTarget = FmExport & {
  order_user_name: string;
  recipient_user_name: string;
} & {
  items: ExportItemWithLiveShopping[];
};
export type BroadcasterSettlementTargetRes = Array<BroadcasterSettlementTarget>;
