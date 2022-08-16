import {
  Goods,
  GoodsImages,
  Order,
  OrderCancellation,
  OrderItem,
  OrderItemOption,
  OrderPayment,
  Refund,
  RefundItem,
  Return,
} from '@prisma/client';
import { PaymentCard, PaymentTransfer, PaymentVirtualAccount } from './paymentsRes.res';
/** 환불생성 리턴데이터 */
export type CreateRefundRes = Refund;

export type RefundListItem = Refund & {
  order: Pick<Order, 'orderCode' | 'customerId' | 'paymentPrice'> & {
    payment: OrderPayment;
  };
  orderCancellation: OrderCancellation[];
  return: Return[];
  items: RefundItem[];
};
/** 환불 목록조회 리턴데이터 => 프론트 작업하면서 필요한 형태로 수정필요 */
export type RefundListRes = {
  list: RefundListItem[];
  count: number;
  nextCursor?: number;
};

/** 환불내역 상세 리턴데이터  => 프론트 작업하면서 필요한 형태로 수정
 */
export type RefundDetailRes = Refund & {
  order: {
    orderCode: Order['orderCode'];
    createDate: Order['createDate'];
    payment: {
      method: OrderPayment['method'];
    };
  };
  orderCancellation: OrderCancellation[];
  return: Return[];
  items: {
    goodsId: Goods['id'];
    goodsName: Goods['goods_name'];
    image: GoodsImages['image'];
    shippingCost: OrderItem['shippingCost'];
    shippingCostIncluded: OrderItem['shippingCostIncluded'];
    name: OrderItemOption['name'];
    value: OrderItemOption['value'];
    quantity: OrderItemOption['quantity'];
    normalPrice: OrderItemOption['normalPrice'];
    discountPrice: OrderItemOption['discountPrice'];
  }[];
  card?: PaymentCard;
  virtualAccount?: PaymentVirtualAccount;
  transfer?: PaymentTransfer;
};
