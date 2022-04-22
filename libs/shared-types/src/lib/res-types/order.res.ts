import {
  Broadcaster,
  Exchange,
  Export,
  Goods,
  GoodsImages,
  Order,
  OrderCancellation,
  OrderItem,
  OrderItemOption,
  OrderItemSupport,
  OrderPayment,
  Refund,
  Return,
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
};

export type OrderItemWithRelations = OrderItem & {
  support: OrderItemSupportWithBroadcasterInfo | null;
  options: OrderItemOption[];
  goods: OriginGoods;
};

export type OrderDataWithRelations = Order & {
  orderItems: OrderItemWithRelations[];
  payment?: OrderPayment | null;
};

/** 주문 목록 리턴 데이터 타입 */
export type OrderListRes = {
  orders: OrderDataWithRelations[];
  count: number;
};

/** 주문 상세 리턴데이터 타입
 * 주문 완료 페이지 혹은 주문 상세 페이지 작업하면서 수정 필요
 */
export type OrderDetailRes = OrderDataWithRelations & {
  refunds: Refund[] | null;
  returns: Return[] | null;
  exports: Export[] | null;
  exchanges: Exchange[] | null;
  orderCancellations: OrderCancellation[] | null;
};
