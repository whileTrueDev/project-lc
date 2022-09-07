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
  ShippingOption,
  ShippingCost,
  ShippingSet,
  ShippingGroup,
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
  support?: Nullable<OrderItemSupportWithBroadcasterInfo>;
  review?: GoodsReview | null;
  options: OrderItemOption[];
  goods: OriginGoods;
};

export type OrderCancellationBaseData = Pick<
  OrderCancellation,
  'id' | 'cancelCode' | 'requestDate' | 'completeDate' | 'status'
> & {
  items: OrderCancellationItem[];
};
export type ExportBaseData = Export & { items: ExportItem[] };
export type ExchangeBaseData = Exchange & {
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
  shippings: Nullable<OrderDetailShipping[]>;
  sellerSettlementItems?: SellerSettlementItemsRes[] | null;
};

/** 주문 목록 리턴 데이터 타입 */
export type OrderListRes = {
  orders: OrderDataWithRelations[];
  count: number;
  nextCursor?: number; // infinite Query 에서 사용하기 위한 다음 skip 값
};

export type OrderDetailShipping = OrderShipping & {
  items: (OrderItem & { options: OrderItemOption[] })[];
};

/** 주문 상세 리턴데이터 타입 -> 주문 완료 페이지 혹은 주문 상세 페이지 작업하면서 수정 필요
 */
export type OrderDetailRes = OrderBaseData & {
  exchanges: Nullable<ExchangeDataWithImages[]>;
  returns: Nullable<ReturnDataWithImages[]>;
  shippings: Nullable<OrderDetailShipping[]>;
  sellerSettlementItems?: SellerSettlementItemsRes[] | null;
};
/**
 * 방송인 후원 주문 목록 타입
 */
export interface FindAllOrderByBroadcaster {
  orderCode: string;
  orderPrice: number;
  paymentPrice: number;
  giftFlag: boolean;
  supportOrderIncludeFlag: boolean;
  createDate: Order['createDate'];
  orderItems: Array<{
    id: OrderItem['id'];
    channel: SellType;
    options: OrderItemOption[];
    review: GoodsReview | null;
    support?: OrderItemSupport;
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

/**
 * 가지고 있는 정보
 * ShippingGroup - 반송지정보, 배송비 계산방식, 기본/추가배송비 부과 여부, shippingSet[] 등
 * ShippingSet - 배송방식(택배, 직접배송 등), 전국배송/일부지역배송, 배송비 선불여부, shippingOption[]
 * ShippingOption - 기본/추가배송비 여부,
 * ShippingCost - 배송비, 적용지역
 */
export type ShippingOptionWithCost = ShippingOption & {
  shippingCost: ShippingCost[];
};
export type ShippingSetWithOptions = ShippingSet & {
  shippingOptions: Array<ShippingOptionWithCost>;
};

export type ShippingGroupData =
  | (ShippingGroup & {
      shippingSets: Array<ShippingSetWithOptions>;
    })
  | null;

export type ShippingOptionCost = {
  std: number; // 기본배송비
  add: number; // 추가배송비
};

export type ShippingCostCalculatedType = {
  isShippingAvailable: boolean;
  cost: ShippingOptionCost | null;
};

/** 배송비계산 리턴타입 */
export type ShippingCostByShippingGroupId = Record<
  number, // 배송비그룹 id
  ShippingCostCalculatedType & {
    items: number[]; // 해당배송비그룹에 연결된 goodsId[]
  }
>;

/** 관리자 라이브쇼핑 선물주문 타입 */
export type AdminLiveShoppingGiftOrder = Order & {
  orderItems: (OrderItem & {
    support: OrderItemSupportWithBroadcasterInfo | null;
    options: OrderItemOption[];
    goods: Omit<OriginGoods, 'image' | 'sellerId'>;
  })[];
};

/** 비회원 주문상세조회 타입 */
export type NonMemberOrderDetailRes = {
  order: OrderDetailRes;
};
