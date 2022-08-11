import {
  Coupon,
  CustomerCoupon,
  CustomerCouponLog,
  CustomerMileageLog,
  Order,
  OrderItem,
  OrderItemOption,
  OrderPayment,
  OrderShipping,
  Refund,
  Return,
  ReturnImage,
  ReturnItem,
  SellerShop,
} from '@prisma/client';
import { ExchangeReturnCancelItemBaseData } from './orderCancellation.res';

export type CreateReturnRes = Return;

export type ReturnItemData = ExchangeReturnCancelItemBaseData & {
  /** 주문취소상품 고유번호 */
  id: ReturnItem['id'];
  /** 주문취소상품 개수 */
  quantity: ReturnItem['quantity'];
  /** 주문취소상품 처리 상태 */
  status: ReturnItem['status'];
};

export type ReturnData = Omit<Return, 'items'> & {
  refund: Refund | null;
  order: { orderCode: Order['orderCode'] };
  items: ReturnItemData[];
};
export type ReturnListRes = {
  list: ReturnData[];
  totalCount: number;
  nextCursor?: number;
};

export type ReturnDetailRes = ReturnData & { images: ReturnImage[] };

export type UpdateReturnRes = boolean;

export type DeleteReturnRes = boolean;

// ------------------------

export type CustomerCouponLogWithCouponInfo = CustomerCouponLog & {
  customerCoupon: CustomerCoupon & { coupon: Coupon };
};

/** 관리자페이지에서 환불처리 위해 필요한 주문 데이터와 마일리지, 쿠폰사용로그 등 정보 */
export type OrderWithPaymentData = {
  id: Order['id'];
  orderCode: Order['orderCode'];
  payment: OrderPayment;
  orderPrice: Order['orderPrice'];
  paymentPrice: Order['paymentPrice'];
  ordererName: Order['ordererName'];
  customerCouponLogs: CustomerCouponLogWithCouponInfo[];
  mileageLogs: CustomerMileageLog[];
  shippings: OrderShipping[];
};

export type ReturnItemWithOriginOrderItemInfo = ReturnItem & {
  orderItem: {
    id: OrderItem['id'];
    goods: { seller: { sellerShop: SellerShop } };
    orderShippingId: OrderItem['orderShippingId'];
  };
  orderItemOption: OrderItemOption;
};

export type AdminReturnData = Return & {
  order: OrderWithPaymentData;
  items: ReturnItemWithOriginOrderItemInfo[];
  images: ReturnImage[];
  refund: Refund | null;
};
/** 관리자페이지에서 환불처리 위해 필요한 교환요청(Return) 데이터와 기타 연관 정보 */
export type AdminReturnRes = AdminReturnData[];
