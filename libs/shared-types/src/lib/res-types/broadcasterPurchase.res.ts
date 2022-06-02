import {
  Goods,
  Order,
  OrderItem,
  OrderItemOption,
  OrderItemSupport,
} from '@prisma/client';

export type BroadcasterPurchasesItem = OrderItem & {
  order: Pick<
    Order,
    'orderCode' | 'id' | 'step' | 'paymentPrice' | 'supportOrderIncludeFlag'
  >;
  goods: {
    goods_name: Goods['goods_name'];
  };
  options: OrderItemOption[];
  support: OrderItemSupport;
};

export type BroadcasterPurchasesRes = BroadcasterPurchasesItem[];
