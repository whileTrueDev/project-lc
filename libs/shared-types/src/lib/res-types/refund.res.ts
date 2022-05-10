import {
  Order,
  OrderCancellation,
  OrderPayment,
  Refund,
  RefundItem,
  Return,
} from '@prisma/client';

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
 // TODO: 타입지정필요
*/
export type RefundDetailRes = any;
