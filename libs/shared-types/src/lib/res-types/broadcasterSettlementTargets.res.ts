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
export type BroadcasterSettlementTargetRes = Array<
  FmExport & { items: ExportItemWithLiveShopping[] }
>;
