import {
  Broadcaster,
  Coupon,
  CustomerCoupon,
  CustomerCouponLog,
  CustomerMileageLog,
  Exchange,
  ExchangeImage,
  ExchangeItem,
  Export,
  ExportItem,
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
  OrderShipping,
  Refund,
  Return,
  ReturnImage,
  ReturnItem,
  Seller,
  SellType,
  SellerShop,
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
  seller: { sellerShop: { shopName: SellerShop['shopName'] } };
};

type Nullable<T> = T | null;

export type OrderItemWithRelations = OrderItem & {
  support: Nullable<OrderItemSupportWithBroadcasterInfo>;
  review?: { id: GoodsReview['id'] };
  options: OrderItemOption[];
  goods: OriginGoods;
};

export type OrderCancellationBaseData = Pick<
  OrderCancellation,
  'id' | 'cancelCode' | 'requestDate' | 'completeDate' | 'status'
> & {
  items: OrderCancellationItem[];
};
export type ExportBaseData = Export;
export type ExchangeBaseData = Pick<
  Exchange,
  'id' | 'exchangeCode' | 'status' | 'requestDate' | 'completeDate'
> & {
  exchangeItems: ExchangeItem[];
};
export type ReturnBaseData = Pick<
  Return,
  'id' | 'returnCode' | 'status' | 'requestDate' | 'completeDate'
> & { items: ReturnItem[] };
export type ReturnDataWithImages = ReturnBaseData & { images: ReturnImage[] };
export type ExchangeDataWithImages = ExchangeBaseData & { images: ExchangeImage[] };

export type OrderBaseData = Order & {
  orderItems: OrderItemWithRelations[];
  payment?: Nullable<OrderPayment>;
  refunds: Nullable<Refund[]>;
  shippings: (OrderShipping & { items: OrderItemOption[] })[];
  orderCancellations?: Nullable<OrderCancellationBaseData[]>;
  exports: Nullable<ExportBaseData[]>;
  mileageLogs: CustomerMileageLog[] | null;
  customerCouponLogs: CustomerCouponLogWithCustomerCoupon[] | null;
};

export interface CustomerCouponWithCoupon extends CustomerCoupon {
  coupon: Coupon;
}
export interface CustomerCouponLogWithCustomerCoupon extends CustomerCouponLog {
  customerCoupon: CustomerCouponWithCoupon;
}

export type SellerSettlementItemsRes = {
  liveShopping: {
    broadcaster: {
      userNickname: Broadcaster['userNickname'];
    };
  };
};

export type OrderDataWithRelations = OrderBaseData & {
  exchanges: Nullable<ExchangeBaseData[]>;
  returns: Nullable<ReturnBaseData[]>;
  sellerSettlementItems?: SellerSettlementItemsRes[] | null;
};

/** 주문 목록 리턴 데이터 타입 */
export type OrderListRes = {
  orders: OrderDataWithRelations[];
  count: number;
  nextCursor?: number; // infinite Query 에서 사용하기 위한 다음 skip 값
};

/** 주문 상세 리턴데이터 타입 -> 주문 완료 페이지 혹은 주문 상세 페이지 작업하면서 수정 필요
 */
export type OrderDetailRes = OrderBaseData & {
  exchanges: Nullable<ExchangeDataWithImages[]>;
  returns: Nullable<ReturnDataWithImages[]>;
  sellerSettlementItems?: SellerSettlementItemsRes[] | null;
};
/**
 * 방송인 후원 주문 목록 타입
 */
export interface FindAllOrderByBroadcaster {
  orderCode: string;
  step: string;
  orderPrice: number;
  paymentPrice: number;
  giftFlag: boolean;
  supportOrderIncludeFlag: boolean;
  createDate: Order['createDate'];
  orderItems: Array<{
    id: OrderItem['id'];
    channel: SellType;
    review: GoodsReview | null;
    support: OrderItemSupport;
    goods: {
      goods_name: Goods['goods_name'];
      image: GoodsImages[];
      seller: {
        sellerShop: {
          shopName: string | null;
        };
      };
    };
  }>;
}
export type FindAllOrderByBroadcasterRes = {
  orders: FindAllOrderByBroadcaster[];
  nextCursor?: number;
};

/** 관리자 라이브쇼핑 선물주문 타입 */
export type AdminLiveShoppingGiftOrder = Order & {
  orderItems: (OrderItem & {
    support: OrderItemSupportWithBroadcasterInfo | null;
    options: OrderItemOption[];
    goods: Omit<OriginGoods, 'image' | 'sellerId'>;
  })[];
};
