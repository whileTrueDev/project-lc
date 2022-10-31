# nest-modules-payment

This library was generated with [Nx](https://nx.dev).

payment.controller.ts           : 결제승인요청 성공시 실제 결제처리 & 주문생성처리 담당
payment-webhook.controller.ts   : 토스페이먼츠 웹훅 처리 (가상결제건에 대한 입금완료 등 이벤트가 웹훅으로 들어옴)
payment-info.controller.ts      : 토스페이먼츠 결제정보 조회 처리

payment-exception.filter.ts     : 결제처리 & 주문생성과정에서 발생하는 에러처리
## Running unit tests

Run `nx test nest-modules-payment` to execute the unit tests via [Jest](https://jestjs.io).
