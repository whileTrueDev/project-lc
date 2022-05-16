import {
  Goods,
  GoodsImages,
  Order,
  OrderCancellation,
  OrderCancellationItem,
  OrderItem,
  OrderItemOption,
  Refund,
  SellerShop,
} from '@prisma/client';

// *------------ 주문취소 생성 리턴값 ------------------
/** 주문취소요청 리턴데이터 타입 (프론트 작업시 필요한 형태로 수정하여 사용) */
export type CreateOrderCancellationRes = OrderCancellation;

// *------------ 주문취소 목록조회 리턴값 ------------------

/** 교환,환불,주문취소 아이템 공통 조회 데이터 */
export interface ExchangeReturnCancelItemBaseData {
  /** 주문상품명 */
  goodsName: Goods['goods_name'];
  /** 주문상품이미지 */
  image: GoodsImages['image'];
  /** 주문상품 판매상점명 */
  shopName: SellerShop['shopName'];
  /** 주문 당시 상품옵션명 */
  optionName: OrderItemOption['name'];
  /** 주문 당시 상품옵션값 */
  optionValue: OrderItemOption['value'];
  /** 주문 당시 지불한 주문상품옵션 가격 */
  price: number;
  /** 요청 상품이 연결된 주문상품고유번호 - 환불처리시 필요한 데이터 */
  orderItemId: OrderItem['id'];
  /** 요청 상품이 연결된 주문상품옵션고유번호 - 환불처리시 필요한 데이터 */
  orderItemOptionId: OrderItemOption['id'];
}
/** 주문취소 신청내역 리턴데이터 타입 (프론트 작업시 필요한 형태로 수정하여 사용) */
export type OrderCancellationItemData = ExchangeReturnCancelItemBaseData & {
  /** 주문취소상품 고유번호 */
  id: OrderCancellationItem['id'];
  /** 주문취소상품 개수 */
  amount: OrderCancellationItem['amount'];
  /** 주문취소상품 처리 상태 */
  status: OrderCancellationItem['status'];
};
export type OrderCancellationData = Omit<OrderCancellation, 'items'> & {
  refund?: Refund | null;
  order: { orderCode: Order['orderCode'] };
  items: OrderCancellationItemData[];
};
export type OrderCancellationListRes = {
  list: OrderCancellationData[];
  totalCount: number;
  nextCursor?: number;
};

export type OrderCancellationDetailRes = OrderCancellationData; // TODO : 환불 api 합쳐진 후(환불 스키마 수정됨) 토스 결제데이터 추가

// *------------ 주문취소 상태변경 리턴값 ------------------
/** 주문취소 수정 리턴타입 */
export type OrderCancellationUpdateRes = OrderCancellation;

// *------------ 주문취소 삭제 리턴값 ------------------
/** 주문취소 삭제 리턴값 */
export type OrderCancellationRemoveRes = boolean;
