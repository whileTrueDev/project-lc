# shared-types

이 라이브러리는 하나 이상의 애플리케이션에서 동일하게 사용되는 타입정의를 다루는 라이브러리입니다.

## 설명

되도록이면 이 라이브러리에서 타입을 참조하는 경우 다음과 같이 사용하기를 권장합니다.

```ts
import type { SomeType } from '@project-lc/shared-types';
```

또한, 다른 라이브러리와 마찬가지로, `src/index.ts` 에서 올바르게 export 하셔야 합니다.

## Running unit tests

Run `nx test shared-types` to execute the unit tests via [Jest](https://jestjs.io).
