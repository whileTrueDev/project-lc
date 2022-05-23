import {
  Broadcaster,
  Exchange,
  ExchangeItem,
  Export,
  Goods,
  GoodsImages,
  GoodsReview,
  Order,
  OrderCancellation,
  OrderCancellationItem,
  OrderItem,
  OrderItemOption,
  OrderItemSupport,
  OrderPayment,
  Refund,
  Return,
  ReturnItem,
  Seller,
} from '@prisma/client';

export type OrderItemSupportWithBroadcasterInfo = OrderItemSupport & {
  broadcaster: {
    userNickname: Broadcaster['userNickname'];
    avatar: Broadcaster['avatar'];
  };
};

export type OriginGoods = {
  id: Goods['id'];
  goods_name: Goods['goods_name'];
  image: GoodsImages[];
  sellerId: Seller['id'];
};

export type OrderItemWithRelations = OrderItem & {
  support: OrderItemSupportWithBroadcasterInfo | null;
  review?: { id: GoodsReview['id'] };
  options: OrderItemOption[];
  goods: OriginGoods;
};

export type OrderDataWithRelations = Order & {
  orderItems: OrderItemWithRelations[];
  payment?: OrderPayment | null;
  refunds: Refund[] | null;
  exports: Export[] | null;
  exchanges:
    | (Pick<Exchange, 'id' | 'exchangeCode'> & { exchangeItems: ExchangeItem[] })[]
    | null;
  returns: (Pick<Return, 'id' | 'returnCode'> & { items: ReturnItem[] })[] | null;
  orderCancellations?:
    | (Pick<OrderCancellation, 'id' | 'cancelCode'> & {
        items: OrderCancellationItem[];
      })[]
    | null;
};

/** 주문 목록 리턴 데이터 타입 */
export type OrderListRes = {
  orders: OrderDataWithRelations[];
  count: number;
  nextCursor?: number; // infinite Query 에서 사용하기 위한 다음 skip 값
};

/** 주문 상세 리턴데이터 타입
 * 주문 완료 페이지 혹은 주문 상세 페이지 작업하면서 수정 필요
 */
export type OrderDetailRes = OrderDataWithRelations;
