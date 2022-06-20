import {
  Export,
  ExportItem,
  LiveShopping,
  OrderItemOption,
  OrderItemSupport,
  ProductPromotion,
  SellType,
} from '@prisma/client';

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
