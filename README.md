# Project-lc

project-lc의 lc는 live commerce의 앞글자만 따왔습니다.

## 프로젝트 구조 및 프로젝트 관리

프로젝트는 [Nx](https://nx.dev) 환경 하에서 개발 진행합니다.
Nx는 monorepo환경을 효율적이고 효과적으로 구성할 수 있도록 돕습니다. Jest, Cypress, ESLint, Storybook 등 여러 많은 툴과 React, Next, Nest, Angular 등의 애플리케이션을 지원합니다.

Nx는 모듈식 코드 단위를 유지 및 관리하고, 이들 간의 종속성을 이해하는 코어를 기반으로 구현되었습니다. 이러한 dependency를 이해하는 코어를 바탕으로 한 캐시를 통해, 기존 monorepo와 달리 CI 파이프라인에서 속도 저하를 최소화합니다.

Nx에서는 코드 모듈의 종류를 Application과 Library 두 가지로 나눕니다. `/apps` 폴더에는 애플리케이션 프로젝트가 위치합니다. `/libs` 폴더에는 라이브러리 프로젝트가 위치합니다.

가능한 `/apps` 폴더 내에 위치한 애플리케이션 코드를 작은 크기로 유지하는 것이 좋습니다. 코어 사용 부분은 대부분 `/libs` 폴더에 위치한 라이브러리 프로젝트에서 구현되고 애플리케이션에서는 라이브러리 코드를 가져와 사용합니다.

### apps 목록

1. [api](./apps/api/README.md)
   [Nest.js](https://docs.nestjs.com/)로 구성된 REST API 서버입니다.
2. [socket](./apps/socket/README.md)
   [Nest.js + Socket.io](https://docs.nestjs.com/websockets/gateways)로 구성된 WebScoket 서버입니다.
3. [web](./apps/web/README.md)
   [Next.js](https://nextjs.org/)로 구성된 프론트엔드 서버입니다.
4. [web-e2e](./apps/web-e2e/README.md)
   `web` 애플리케이션에 대한 Cypress end to end 테스트 폴더입니다.

### libs 목록

1. `components`
   pages를 제외한 모든 컴포넌트가 여기에서 생성되고 관리됩니다. atomic디자인을 따르지는 않으며, 모든 컴포넌트는 독립적이어야 하며, 상하관계를 가지는 경우, 하위 폴더를 생성하여 컴포넌트를 생성하고 작업할 수 있으나 되도록이면 컴포넌트를 세부적 단위로 쪼갠 채, pages 내에서 가져와 사용하도록 하기를 권장합니다. react를 위한 컴포넌트가 이 라이브러리의 주를 이루며, react-native 컴포넌트는 `ExampleComponent.native.ts`와 같이 생성할 수 있습니다. (react-native는 ReactDOM을 사용하지 않으므로 ReactDOM상에서 동작하는 리액트컴포넌트가 react-native에서는 동작하지 않습니다.)
2. `hooks`
   react-query의 query, mutation을 사용할수 있도록 제작한 hook이나, 유틸을 위해 사용되는 hook을 모두 여기에서 생성하고 관리합니다. react, react-native 애플리케이션에서 모두 사용될 수 있습니다.
3. `stores`
   모든 zustand store는 여기에서 생성되고 관리됩니다. react, react-native 애플리케이션에서 모두 사용될 수 있습니다.
4. `prisma-orm`
   데이터베이스 접근 및 모델 정의를 위한 라이브러리로, api, socket과 같이 데이터베이스 접근이 필요한 앱에서 사용될 수 있습니다.
   이 라이브러리에 위치한 스키마를 토대로 생성한 Prisma-Client에서 제공되는 Type정의를 React 앱 등에서 사용할 수 있습니다.
5. `shared-types`
   공유되는 Typescript 타입정보는 모두 여기에서 생성되고 관리됩니다. Prisma Client를 통해 백엔드, 프론트엔드간 통신에 대한 타입정의(DTO, EntityType, ...)가 공유될 수 있으므로 비교적 많은 수의 타입이 생성되지 않으리라 생각합니다만, 공유되는 타입은 모두 여기에 정의하고 사용합니다.

## 새 애플리케이션 / 라이브러리 생성하기

필요시, dan(hwasurr)에게 말씀하세요.
자세히 알아보고 싶은 분은 [nrwl/Nx](https://nx.dev/latest/react/getting-started/intro) 에서 알아볼 수 있습니다.
새로운 App과 Lib은 임의로 생성하지 마시고, 슬랙에 공표 및 토의 이후 생성하도록 합니다.

## 디펜던시 추가하기

Nx 이용을 통해 관리하므로, 각 폴더별로 따로 디펜던시를 관리하지 않습니다. (package.json, node_modules를 가지지 않습니다.) 최상위 폴더에서 `yarn add`(개발용 디펜던시의 경우 `yarn add --dev`) 를 통해 디펜던시를 추가할 수 있습니다.

## 개발 시작하기 (개발시, 앱 실행하기)

`yarn start <APP_NAME>`

## 빌드

`yarn build <APP_NAME>`

프로덕션을 위한 빌드시 `--prod` 옵션 추가

## 테스트

- 단위 테스트
`yarn test <APP_NAME OR LIB_NAME>`
- 파일이 변경된 앱/라이브러리만 단위 테스트
`nx affected:test`
- web 종단간 테스트(End to End)
`yarn e2e web-e2e`
- 파일이 변경된 앱/라이브러리만 종단간 테스트(End to End)
`nx affected:e2e`

## Lint

`yarn lint <APP_NAME OR LIB_NAME>`

## 디펜던시 그래프 확인하기

`yarn nx dep-graph`

## Dev 환경에서의 Prisma ORM 사용법

Dev 환경 데이터베이스는 각자 로컬에 설치하여 사용하도록 합니다. Docker MySQL이미지 활용하셔도 무방합니다.

1. **Prisma 소스로 스키마 관리**  

   새로운 테이블 및 컬럼의 추가는 모두 `libs/prisma-orm/prisma/schema.prisma`파일에 PSL(Prisma Schema Language)로 작성됩니다. `schema.prisma` 파일은 [Single Source of Truth](https://ko.wikipedia.org/wiki/%EB%8B%A8%EC%9D%BC_%EC%A7%84%EC%8B%A4_%EA%B3%B5%EA%B8%89%EC%9B%90)입니다. 변경사항 및 새로운 엔터티를 `schema.prisma` 구성했더라도, 해당 변경사항은 연결된 데이터베이스에 곧바로 반영되지 않습니다.

2. **데이터베이스에 스키마 반영하기**

    데이터베이스에 schema.prisma 의 사항을 반영하기 위해서는 마이그레이션 작업이 필요합니다. `prisma migrate <TYPE_OF_TASK>` 의 명령어로 마이그레이션을 진행할 수 있습니다.

    ```bash
    yarn nx run prisma-orm:migrate-up --name <MIGRATION_NAME>
    ```

    앞의 명령어는 SQL 마이그레이션 파일을 생성함과 동시에, 해당 마이그레이션 SQL 파일을 연결된 데이터베이스에 실행합니다. 이를 통해 데이터베이스 테이블을 생성하는 작업이 완료되었습니다.

    만약 데이터베이스에 마이그레이션 작업을 실행하지 않고, 마이그레이션 파일만 만들고 싶은 경우 다음 명령어를 사용할 수 있습니다.

    ```bash
    yarn nx run prisma-orm:migrate-save
    ```

    실행한 마이그레이션 작업을 취소하고자 한다면 다음 명령어를 실행시킬 수 있습니다.

    ```bash
    yarn nx run prisma-orm:migrate-reset
    ```

    주의  
    `yarn nx run prisma-orm:migrate-save`, `yarn nx run prisma-orm:migrate-reset` 명령어는 개발환경에서만 사용합니다. 절대 프로덕션 마이그레이션 작업에 해당 명령어를 사용하지 않습니다.

    참고  
    prisma 공식문서와 다르게, yarn nx run 으로 실행시키는 이유는 사용될 수 있는 몇 가지 prisma 명령어를 개발 환경에서 사용될 수 있는 몇가지 명령어로 다시 정리해두었기 때문입니다. 또한 nx만의 구조 때문에 --schema 옵션을 통해 파일을 명시해주어야만 하므로, 해당 옵션까지 모두 포함시켜 정리해뒀습니다.

3. **Prisma Client 생성하기**

    개발환경에서 사용될 수 있는 위의 `prisma migrate dev` 명령어는 마이그레이션 작업을 실행함과 동시에 자동적으로 Prisma Client를 생성하는 작업까지 실행합니다.

    위와 같은 상황이 아닌 경우, 다음 명령어로 Prisma Client를 생성합니다. Prisma Client는 데이터베이스에 접근할 수 있는 엔진을 탑재한 업격히 타입정의된 클래스입니다. 이 명령어의 작업은 Prisma Client를 함과 동시에 input과 arguments에 대한 타입정의도 함께 생성합니다.

    ```bash
    yarn nx run prisma-orm:prisma-generate
    ```

    해당 명령어에 데이터베이스 doc을 함께 생성하도록 플러그인을 추가해두었습니다. 명령어 실행 이후에는 `libs/prisma-orm/prisma/docs` 폴더가 생성되며, 해당 폴더의 `index.html` 파일을 열면, DB 레퍼런스에 대한 문서를 확인할 수 있습니다.

4. **Prisma Client를 통해 데이터 접근하기**

    데이터베이스 접근을 위한 `/libs/src/lib/prisma-orm.service` 를 미리 정의해 두었습니다. API서버 또는 Socket 서버와 같이 데이터베이스 접근이 필요한 경우, 해당 service를 가져와 사용합니다. `apps/api`, `apps/socket` 두 애플리케이션의 app.module에 prismaService를 provider로 작성하여 두었으므로, AppModule의 하위 모듈에서는 모두 prismaService에 접근가능합니다.

    ```typescript
    // DB 접근 객체 (dependency injection 통해 사용)
    import { PrismaService } from '@project-lc/prisma-orm';
    // InputTypes, OutputTypes, ModelTypes
    import { Prisma, Post } from '@prisma/client';

    @Injectable()
    export class SomeService {
        // prisma service dependency injection
        constructor(private readonly prisma: PrismaService) {}

        findPosts(params: {
            skip?: number;
            take?: number;
            cursor?: Prisma.UserWhereUniqueInput;
            where?: Prisma.UserWhereInput; // 자동 생성된 Input타입 사용
            orderBy?: Prisma.UserOrderByInput;
        }): Promise<Post[]> { // 자동생성된 엔터티 타입정의를 참조
            // 자동 생성된 DB client를 통해 DB에 접근
            return this.prisma.posts.findMany(params);
        }
    }
    ```

    `@prisma/client`는 위 3번 단락에서 설명한 `generate` 명령어 통해 자동으로 생성된 타입정보가 있는 패키지입니다. `schema.prisma` 스키마 파일 `Post` 에 대한 정보가 있다고 가정하였을 때, 생성된 `@prisma/client` 패키지에는 `Post`가 타입스크립트 인터페이스로 자동으로 정의되어 있습니다.

    주의  
    자동으로 생성된 `@prisma/client` 패키지에서 곧바로 PrismaClient를 가져와 인스턴스화 시켜 사용하지 말고, PrismaService를 사용하시기를 권장합니다. (PrismaClient는 인스턴스화 시킬때마다 개별적으로 connecitonPool을 만들어 사용합니다.) 불가피하게 PrismaClient를 가져와 인스턴스화 하여 사용하여야 하는 경우, `$connect`와 `$disconnect`를 올바른 상황에 사용하셔야 합니다. 그렇지 않은 경우, 데이터베이스 connection이 정상적으로 종료되지 않을 수 있습니다.

    prismaClient의 CRUD 방법에 대한 API 레퍼런스는 [여기](https://www.prisma.io/docs/concepts/components/prisma-client/crud)에서 확인할 수 있습니다.
