import { Broadcaster, LiveShopping, ProductPromotion, SellType } from '@prisma/client';
import { FmExportItem, FmExport } from './fmExport.res';

type BroadcasterInfo = Pick<
  Broadcaster,
  'email' | 'id' | 'userName' | 'userNickname' | 'avatar' | 'agreementFlag'
>;
export type ExportItemWithMarketingMethod = FmExportItem & {
  liveShopping?: LiveShopping & {
    broadcaster: BroadcasterInfo;
  };
  productPromotion?: ProductPromotion & {
    broadcasterPromotionPage: {
      broadcaster: BroadcasterInfo;
    };
  };
  sellType: SellType;
};
export type BroadcasterSettlementTarget = FmExport & {
  order_user_name: string;
  recipient_user_name: string;
} & {
  items: ExportItemWithMarketingMethod[];
};
export type BroadcasterSettlementTargetRes = Array<BroadcasterSettlementTarget>;
