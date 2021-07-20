# firstmall-db

이 라이브러리는 firstmall 데이터베이스에 접근하는 모든 코드를 다루는 라이브러리입니다.

## 설명

Nestjs 애플리케이션에서 해당 라이브러리를 사용하려면, 최상단 module에서 `FirstmallDbModule`을 import 하여 사용합니다. (`apps/api` 에는 이미 `FirstmallDbModule`를 app.module에서 의존성 주입하도록 설정해두었습니다.)

다른 모듈 및 라이브러리와의 원활한 구분과 타 서비스의 데이터를 다루는 위험성을 작업자에게 알리기 위해, 퍼스트몰과 관련된 DB에 접근하기 위한 service, module등은 모두 `FM` 접두어 붙여서 작성하도록 합니다.

ex.

- `fm-goods`
- `fm-orders`
- `fm-refunds`
- `fm-returns`

## 테스트

Run `nx test firstmall-db` to execute the unit tests via [Jest](https://jestjs.io).
