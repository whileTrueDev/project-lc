# Project-lc

project-lc의 lc는 live commerce의 앞글자만 따왔습니다.

## 프로젝트 구조 및 프로젝트 관리

프로젝트는 [Nx](https://nx.dev) 환경 하에서 개발 진행합니다.
Nx는 monorepo환경을 효율적이고 효과적으로 구성할 수 있도록 돕습니다. Jest, Cypress, ESLint, Storybook 등 여러 많은 툴과 React, Next, Nest, Angular 등의 애플리케이션을 지원합니다.

Nx는 모듈식 코드 단위를 유지 및 관리하고, 이들 간의 종속성을 이해하는 코어를 기반으로 구현되었습니다. dependency를 이해하는 코어를 바탕으로 한 캐시를 통해, 기존 monorepo와 달리 CI 파이프라인에서 속도 저하를 최소화합니다.

Nx에서는 코드 모듈의 종류를 Application과 Library 두 가지로 나눕니다. `/apps` 폴더에는 애플리케이션 프로젝트가 위치합니다. `/libs` 폴더에는 라이브러리 프로젝트가 위치합니다.

가능한 `/apps` 폴더 내에 위치한 애플리케이션 코드를 작은 크기로 유지하는 것이 좋습니다. 코어 사용 부분은 대부분 `/libs` 폴더에 위치한 라이브러리 프로젝트에서 구현되고 애플리케이션에서는 라이브러리 코드를 가져와 사용합니다.

### Apps 목록

1. [api](./apps/api/README.md)  
   [Nest.js](https://docs.nestjs.com/)로 구성된 REST API 서버입니다.
2. [socket](./apps/socket/README.md)  
   [Nest.js + Socket.io](https://docs.nestjs.com/websockets/gateways)로 구성된 WebScoket 서버입니다.
3. [web](./apps/web/README.md)  
   [Next.js](https://nextjs.org/)로 구성된 프론트엔드 서버입니다.
4. [web-e2e](./apps/web-e2e/README.md)  
   `web` 애플리케이션에 대한 Cypress end to end 테스트 폴더입니다.

### Libs 목록

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

6. `firstmall-db`

   독립몰 데이터베이스에의 접근은 모두 이 라이브러리에서 이루어집니다. 원활한 구분을 위해 퍼스트몰과 관련된 DB에 접근하기 위한 service, module등은 모두 `FM` 접두어를 가집니다.

7. `nest-modules`

   nestjs 애플리케이션에서 동시에 사용가능한 모듈의 경우 여기에 정의합니다. 커스텀으로 생성한 Guard(passport strategy 포함), Pipe, Interceptor, Middleware, ExceptionFilter, Custom Decorator 모두 해당 라이브러리에서 정의합니다. 더 자세한 내용은 [libs/nest-modules](./libs/nest-modules/README.md)에서 확인할 수 있습니다.

## 새 애플리케이션 / 라이브러리 생성하기

필요시, Dan(hwasurr)에게 말씀하세요.  
자세히 알아보고 싶은 분은 [nrwl/Nx](https://nx.dev/latest/react/getting-started/intro) 에서 알아볼 수 있습니다.  
새로운 App과 Lib은 임의로 생성하지 마시고, 슬랙에 공표 및 토의 이후 생성하도록 합니다.

## 디펜던시 추가하기

Nx 이용을 통해 관리하므로, 각 폴더별로 따로 디펜던시를 관리하지 않습니다. (`package.json`, `node_modules`를 폴더별로 따로 가지지 않습니다.) 최상위 폴더에서 `yarn add`(개발용 디펜던시의 경우 `yarn add --dev`) 를 통해 디펜던시를 추가할 수 있습니다.

빌드시 알아서 필요한 디펜던시만 포함되도록 설계되어 있습니다.

## 개발 시작하기 (개발시, 앱 실행하기)

`yarn start <APP_NAME>`

ex.

- `yarn start api`
- `yarn start web`

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

## ESLint 및 Prettier 설정 변경하기

임의로 변경하지 마세요. Dan(hwasurr)에게 상의 후 변경하시기 바랍니다. 또는 슬랙 및 미팅을 통해 결정합니다.

## 더 자세히 알아보기

App, Lib 별 더 자세한 내용은 해당 폴더의 README.md에 있습니다.

- [apps/api](./apps/api/README.md)
- [apps/socket](./apps/socket/README.md)
- [apps/web](./apps/web/README.md)
- [libs/components](./libs/components/README.md)
- [libs/hooks](./libs/hooks/README.md)
- [libs/stores](./libs/stores/README.md)
- [libs/prisma-orm](./libs/prisma-orm/README.md)
- [libs/firstmall-db](./libs/firstmall-db/README.md)
- [libs/shared-types](./libs/shared-types/README.md)
- [libs/nest-modules](./libs/nest-modules/README.md)

## 브랜치 전략

- `master`: 현재 서비스중인 브랜치입니다.
   - 필요 review 인원 2명 + code owner
   - 언제나 `staging` 또는 `hotfix` 브랜치로부터 병합됩니다.
- `staging`: 개발 완료 및 테스트까지 완료된 배포 대기중인 코드에 대한 브랜치입니다.
   - 필요 review 인원 1명
- `dev`: 개발용 브랜치입니다. 각 인원의 개발 사항을 통합하는 데에 사용됩니다. 또한 테스트서버에 서비스중인 브랜치입니다.
   - 코드 충돌 해결 작업을 여기서 진행하는 것이 좋습니다.
   - 테스트환경으로 곧바로 배포되도록 연결되어 있습니다.
- `<개발자 개인>-<작업명>`: 개인 개발 작업을 위한 브랜치입니다.
- `hotfix`: 매우 급한 릴리즈된 `master`에 변경사항이 필요한 경우 사용하는 지름길용 브랜치입니다.
   - 위험도에 따라 사용하되, 되도록 사용하지 않도록 합니다.

기본 프로세스: `개발자개인` 브랜치 -> `dev` (코드 충돌 해결 필요, 푸쉬 불가, only PR)  
로컬에서 테스트 필요시: 작업 완료된 `dev`로 진행  (푸쉬 불가, only PR)
테스트 완료시: `dev` -> `staging` (푸시 불가, only PR)  
배포시: `staging` -> `master` (푸시 불가, only PR)  
핫픽스 필요시: `hotfix` -> `master` (푸시 불가, only PR)  