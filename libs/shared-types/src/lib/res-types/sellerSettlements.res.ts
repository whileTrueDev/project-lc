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
  Seller,
  SellerSettlementAccount,
  SellerShop,
} from '@prisma/client';

type SellerSettlementTargetsExportItem = Pick<
  ExportItem,
  'id' | 'quantity' | 'status'
> & {
  orderItem: {
    channel: OrderItem['channel'];
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
      > | null;
      productPromotion: Pick<
        ProductPromotion,
        'id' | 'whiletrueCommissionRate' | 'broadcasterCommissionRate'
      > | null;
    };
  };
  orderItemOption: OrderItemOption;
};
export type SellerSettlementTarget = Export & {
  items: Array<SellerSettlementTargetsExportItem>;
  seller: Pick<Seller, 'email' | 'name'> & {
    sellerShop: { shopName: SellerShop['shopName'] };
    sellerSettlementAccount: SellerSettlementAccount[] | null;
  };
  order: Pick<
    Order,
    'id' | 'recipientName' | 'ordererName' | 'supportOrderIncludeFlag' | 'createDate'
  > & {
    payment: Pick<OrderPayment, 'method'> | null;
  };
};

export type SellerSettlementTargetRes = SellerSettlementTarget[];
