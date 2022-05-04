# nest-modules-return

This library was generated with [Nx](https://nx.dev).

반품처리를 담당하는 모듈입니다
크크쇼 현재 주력 판매상품인 식품의 특성상 반품이 어려워 
상품 회수처리를 하지 않고 환불처리만 하거나 상품을 재배송하는 형태로 진행합니다.
나중에 회수가능한 상품도 판매할 것을 고려하여 Return 테이블을 그대로 사용합니다.
상품을 회수하지 않고 환불만 진행한 반품건도 Return 데이터를 남겨두고 memo에 상품회수하지 않았음을 기록해둘 예정입니다.

## Running unit tests

Run `nx test nest-modules-return` to execute the unit tests via [Jest](https://jestjs.io).
