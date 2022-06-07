import {
  Broadcaster,
  Export,
  ExportItem,
  Goods,
  GoodsImages,
  LiveShopping,
  Order,
  OrderItem,
  OrderItemOption,
  OrderPayment,
  ProductPromotion,
  SellerSettlementAccount,
  SellerShop,
} from '@prisma/client';

type SellerSettlementTargetsExportItem = Pick<ExportItem, 'id' | 'amount' | 'status'> & {
  orderItem: {
    channel: OrderItem['channel'];
    order: { id: Order['id'] } & {
      payment: Pick<OrderPayment, 'method'> | null;
    };
    goods: {
      goods_name: Goods['goods_name'];
      image: Pick<GoodsImages, 'id' | 'image'>[];
    };
    support: {
      broadcaster: Pick<Broadcaster, 'id' | 'userName' | 'userNickname' | 'avatar'>;
      liveShopping: Pick<
        LiveShopping,
        | 'liveShoppingName'
        | 'id'
        | 'whiletrueCommissionRate'
        | 'broadcasterCommissionRate'
      >;
      productPromotion: Pick<
        ProductPromotion,
        'id' | 'whiletrueCommissionRate' | 'broadcasterCommissionRate'
      >;
    };
  };
  orderItemOption: OrderItemOption;
};
export type SellerSettlementTarget = Export & {
  items: Array<SellerSettlementTargetsExportItem>;
  seller: {
    sellerShop: { shopName: SellerShop['shopName'] };
    sellerSettlementAccount: SellerSettlementAccount[];
  };
  order: Pick<Order, 'recipientName' | 'ordererName'>;
};

export type SellerSettlementTargetRes = SellerSettlementTarget[];
