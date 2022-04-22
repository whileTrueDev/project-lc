import {
  Broadcaster,
  Goods,
  GoodsImages,
  Order,
  OrderItem,
  OrderItemOption,
  OrderItemSupport,
  OrderPayment,
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

/** 주문목록 조회시 주문아이템 타입(Order & 주문관련 relations) */
export type OrderDataWithRelations = Order & {
  orderItems: OrderItemWithRelations[];
  payment?: OrderPayment | null;
};
/** 주문 목록 조회 리턴데이터 타입 */
export type OrderListRes = OrderDataWithRelations[];

/** 주문 상세 조회 리턴데이터 타입 */
export type OrderDetailRes = Order;
