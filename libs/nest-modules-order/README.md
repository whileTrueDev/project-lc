# nest-modules-order

This library was generated with [Nx](https://nx.dev).

* 주문 Order :  하나의 주문에는 여러 상품이 포함될 수 있다
* 주문상품 OrderItem : 주문에 포함된 상품. 주문 당시 Goods와 연결되어 있다
* 주문상품옵션 OrderItemOption : 주문에 포함된 상품 옵션. 실제 가격은 여기 저장된다. 주문 당시 GoodsOption의 가격, 옵션명을 저장함


/order.controller.ts    : 주문 생성, 삭제, 조회, 배송비 조회, 구매확정 라우터
/order.service.ts       : 주문 생성, 삭제, 조회, 배송비 조회, 구매확정 핸들러 모음

/order-cancellation     : 소비자의 주문 취소 관련 처리 담당 (nest-modules-order-cancel 모듈은 현재 사용하지 않는 판매자의 주문취소 요청 처리 담당)

/orderItem          : 리뷰 작성 가능한 주문상품 조회
/orderitemoption    : 주문상품옵션 상태 변경

## Running unit tests

Run `nx test nest-modules-order` to execute the unit tests via [Jest](https://jestjs.io).
