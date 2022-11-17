# nest-modules-exchange


교환요청을 생성,조회,수정,삭제하는 기능을 담당하는 모듈입니다

크크쇼 현재 주력 판매상품인 식품의 특성상 반품이 어려워 
상품 회수처리를 하지 않고 환불처리만 하거나 상품을 재배송하는 형태로 진행합니다.

상품회수하지 않고 재배송 한 내역도 Exchange 테이블에 저장합니다
(나중에 회수가능한 상품도 판매할 것을 고려하여 Exchange 테이블을 그대로 사용합니다)
상품을 회수하지 않고 재배송 진행한 환불건도 Exchange 데이터를 남겨두고 memo에 상품회수하지 않았음을 기록해둘 예정입니다.

소비자가 주문에 대해 재배송요청을 한 경우 생성되는 Exchange 데이터 = '교환요청' 

This library was generated with [Nx](https://nx.dev).


## Running unit tests

Run `nx test nest-modules-exchange` to execute the unit tests via [Jest](https://jestjs.io).
