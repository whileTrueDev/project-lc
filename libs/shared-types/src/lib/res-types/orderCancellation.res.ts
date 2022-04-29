import {
  Goods,
  GoodsImages,
  Order,
  OrderCancellation,
  OrderCancellationItem,
  OrderItemOption,
  Refund,
  SellerShop,
} from '@prisma/client';

/** 주문취소요청 리턴데이터 타입 (프론트 작업시 필요한 형태로 수정하여 사용) */
export type CreateOrderCancellationRes = OrderCancellation;

/** 주문취소 신청내역 리턴데이터 타입 */
export type OrderCancellationItemData = {
  id: OrderCancellationItem['id'];
  amount: OrderCancellationItem['amount'];
  status: OrderCancellationItem['status'];
  goodsName: Goods['goods_name'];
  image: GoodsImages['image'];
  shopName: SellerShop['shopName'];
  optionName: OrderItemOption['name'];
  optionValue: OrderItemOption['value'];
  price: number;
};
export type OrderCancellationData = Omit<OrderCancellation, 'items'> & {
  refund: Refund;
  order: { orderCode: Order['orderCode'] };
  items: OrderCancellationItemData[];
};
export type OrderCancellationListRes = {
  list: OrderCancellationData[];
  totalCount: number;
};
