# shared-types

이 라이브러리는 하나 이상의 애플리케이션에서 동일하게 사용되는 타입정의를 다루는 라이브러리입니다.

## 설명

되도록이면 이 라이브러리에서 타입을 참조하는 경우 다음과 같이 사용하기를 권장합니다.

```ts
import type { SomeType } from '@project-lc/shared-types';
```

또한, 다른 라이브러리와 마찬가지로, `src/index.ts` 에서 올바르게 export 하셔야 합니다.

## Dto와 Response 타입

대표적으로 프론트엔드와 백엔드에서 동시에 필요한 타입인 DTO(Data Transfer Object)와 응답타입은 shared-types에 정의한 뒤, 프론트/백엔드에서 함께 사용하는 것이 알맞은 아키텍처이다.

dto에 class-validator 데코레이터를 추가하고,
해당 dto가 사용되는 라우터에서 ValidationPipe를 적용하여 입력값이 유효한지 확인할 수 있습니다
```
  @Post()
  async signUp(@Body(ValidationPipe) dto: SignUpDto): Promise<Customer> {...}
```

### Prisma Input타입과 DTO

`Prisma generate` 를 통해 Prisma 타입정의를 생성하고 나면 생성되는 `Prisma.FindUniqueInput` 과 같은 인풋 타입들은 DTO와는 다른 타입이라고 생각하시면 됩니다. 데이터베이스에서 요구하는 where 절에 필요한 인풋이 언제나 DTO와 같지만은 않습니다. API에서 요구하는 인풋(DTO)와 데이터베이스의 인풋에 대한 구현이 커플링 되어있는 경우는 좋지 않은 설계이자 구현입니다.

따라서, `Prisma generate`를 통해 생성된 데이터베이스 인풋 타입은 `service`에서만 사용되고, `controller` 에서 `req.query`, `req.body`와 같은 요청 변수를 다루는 경우에는 DTO가 사용될 수 있습니다.

이렇게 DTO와 데이터베이스 인풋을 따로 다루며 DTO에는 `class-validator` 를 이용한 유효성 검사를 추가합니다. `api`, `overlay`, `overlay-controller`, `nest-modules` 와 같은 nest 애플리케이션/라이브러리 에서는 `DTO`와 `ValiationPipe`를 이용해 쉽게 유효성 검사를 진행할 수 있습니다.

## Running unit tests

Run `nx test shared-types` to execute the unit tests via [Jest](https://jestjs.io).
