# utils

This library was generated with [Nx](https://nx.dev).

유틸함수 모음

- calcBroadcasterSettelementTotalInfo.ts : 방송인 정산금액 계산 함수
- calcPgCommission.ts : 정산 정보에 기반하여 정산을 진행할 총금액에서 전자결제 수수료를 계산하는 함수
- calculateShippingCost : 주문에 대한 배송비를 계산하기 위한 함수 모음
- checkOrderDuringLiveShopping.ts : 주문이 라이브쇼핑기간 도중 발생한 것인지 판단하는 함수
- fileUtil.ts : 파일명에서 확장자 추출하는 함수
- getHostUrl. ts : 환경별 호스트 서버 주소 리턴하는 함수 모음
- getImgSrcListFromHtmlStringList : html문자열에서 <img> 태그에 포함된 src 배열 리턴하는 함수(상품상세정보 등에서 사용)
- kkshowMainDataJsonToObject.ts : 크크쇼메인데이터(Json) 형태 <-> dto 형태 변환하는 함수 모음
- parseJsonToGenericType.ts : JSON 타입 데이터를 특정 타입으로 캐스팅하여 반환하는 함수
- tossPaymentsApi.ts : 토스페이먼츠 api요청 래핑 함수 모음


## Running unit tests

Run `nx test utils` to execute the unit tests via [Jest](https://jestjs.io).
