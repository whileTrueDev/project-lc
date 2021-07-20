# nest-modules

이 라이브러리는 nestjs 애플리케이션 간 동시에 활용될 수 있는 module들에 대한 라이브러리입니다.

## 설명

이 라이브러리에서는 controller 보다는, service가 주로 구현되어야 합니다. 사용되는 nestjs애플리케이션에 따라 컨트롤러 경로는 다를 수 있기 때문입니다. 컨트롤러는 각 nestjs애플리케이션 상에서 구현하고, 해당 컨트롤러를 포함하는 모듈에서 nest-modules에 정의된 모듈을 import 하여, apps 내에 구현된 컨트롤러 상에서 사용하는 방식을 취할 수 있습니다.

`/libs/...`의 모듈

```ts
// libs/nest-modules/.../...module.ts
@Module({
    providers: [SomeLibService],
    exports: [SomeLibService],
})
export class SomeLibModule {};
```

`/apps/...`의 모듈

```ts
// apps/api/.../...module.ts

import { SomeLibModule } from '@project-lc/nest-modules';
@Module({
    imports: [SomeLibModule]
    providers: [SomeAppModule],
    exports: [SomeAppService],
})
export class SomeAppModule {};
```

`/apps/...`의 컨트롤러

```ts
// apps/api/.../...service.ts

import { SomeLibService } from '@project-lc/nest-modules';
@Controller()
export class SomeAppController {
    constructor(private readonly someLibService: SomeLibService) {}

    @Get()
    something() {
        return this.someLibService.findSomething();
    }
};
```

## 테스트

Run `nx test nest-modules` to execute the unit tests via [Jest](https://jestjs.io).
