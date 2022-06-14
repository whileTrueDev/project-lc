import {
  Broadcaster,
  Export,
  ExportItem,
  LiveShopping,
  OrderItemOption,
  OrderItemSupport,
  ProductPromotion,
  SellType,
} from '@prisma/client';
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

export type BroadcasterSettlementTargetsItem = Export & {
  items: (ExportItem & {
    orderItem: {
      id: number;
      goods: {
        id: number;
        image: {
          image: string;
        }[];
        goods_name: string;
      };
      order: {
        id: number;
        orderCode: string;
        recipientName: string;
        ordererName: string;
        bundleFlag: boolean;
      };
      channel: SellType;
      support: OrderItemSupport & {
        broadcaster: {
          id: number;
          userNickname: string;
          avatar: string | null;
        };
        liveShopping: LiveShopping;
        productPromotion: ProductPromotion;
      };
    };
    orderItemOption: OrderItemOption;
  })[];
};
export type BroadcasterSettlementTargets = Array<BroadcasterSettlementTargetsItem>;
