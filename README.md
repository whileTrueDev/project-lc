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
2. [overlay](./apps/overlay/README.md)  
   [Nest.js + Socket.io](https://docs.nestjs.com/websockets/gateways)로 구성된 WebScoket 서버입니다.
3. [overlay-controller](./apps/overlay-controller/README.md)  
   [Nest.js + Socket.io](https://docs.nestjs.com/websockets/gateways)로 구성된 WebScoket 서버입니다.
4. [web-seller](./apps/web-seller/README.md)  
   [Next.js](https://nextjs.org/)로 구성된 판매자센터 프론트엔드 서버입니다.
5. [web-broadcaster-center](./apps/web-broadcaster-center/README.md)  
   [Next.js](https://nextjs.org/)로 구성된 방송인센터 프론트엔드 서버입니다.
6. [web-kkshow](./apps/web-kkshow/README.md)  
   [Next.js](https://nextjs.org/)로 구성된 크크쇼 & 크크마켓 프론트엔드 서버입니다.
7. [admin](./apps/admin/README.md)  
   [Next.js](https://nextjs.org/)로 구성된 관리자센터 프론트엔드 서버입니다.
8. [api-realtime](./apps/api-realtime/README.md)  
   [Nest.js + Socket.io](https://docs.nestjs.com/websockets/gateways)로 구성된 WebScoket 서버입니다. 실시간 알림 소켓 연결과 라이브쇼핑 현황판 소켓 연결에 사용됩니다.
9. [batch-inactive-handler](./apps/batch-inactive-handler/README.md)  
   [Nest.js](https://docs.nestjs.com/)로 구성된 크크쇼 유저 휴면계정 확인 및 처리
10. [batch-virtual-account](./apps/batch-inactive-account/README.md)  
   [Nest.js](https://docs.nestjs.com/)로 구성된 미입금 가상계좌 주문 취소처리 standalone 배치프로그램 
11. [mailer](./apps/mailer/README.md)  
   [Nest.js](https://docs.nestjs.com/)로 구성된 마이크로서비스. 본인 인증을 위한 메일 발송 시 사용합니다



### Libs 목록

1. `components`

   pages를 제외한 모든 컴포넌트가 여기에서 생성되고 관리됩니다. atomic디자인을 따르지는 않으며, 모든 컴포넌트는 독립적이어야 하며, 상하관계를 가지는 경우, 하위 폴더를 생성하여 컴포넌트를 생성하고 작업할 수 있으나 되도록이면 컴포넌트를 세부적 단위로 쪼갠 채, pages 내에서 가져와 사용하도록 하기를 권장합니다. react를 위한 컴포넌트가 이 라이브러리의 주를 이루며, react-native 컴포넌트는 `ExampleComponent.native.ts`와 같이 생성할 수 있습니다. (react-native는 ReactDOM을 사용하지 않으므로 ReactDOM상에서 동작하는 리액트컴포넌트가 react-native에서는 동작하지 않습니다.)

2. `hooks`

   react-query의 query, mutation을 사용할수 있도록 제작한 hook이나, 유틸을 위해 사용되는 hook을 모두 여기에서 생성하고 관리합니다. react, react-native 애플리케이션에서 모두 사용될 수 있습니다.

3. `stores`

   모든 zustand store는 여기에서 생성되고 관리됩니다. react, react-native 애플리케이션에서 모두 사용될 수 있습니다.

4. `prisma-orm`

   데이터베이스 접근 및 모델 정의를 위한 라이브러리로, api, overlay, overlay-controller과 같이 데이터베이스 접근이 필요한 앱에서 사용될 수 있습니다.
   이 라이브러리에 위치한 스키마를 토대로 생성한 Prisma-Client에서 제공되는 Type정의를 React 앱 등에서 사용할 수 있습니다.

5. `shared-types`

   공유되는 Typescript 타입정보는 모두 여기에서 생성되고 관리됩니다. 공유되는 타입은 모두 여기에 정의하고 사용합니다.

6. `nest-core`와 `nest-modules-*`

   nestjs 애플리케이션에서 동시에 사용가능한 모듈의 경우 여기에 정의합니다. 커스텀으로 생성한 Guard(passport strategy 포함), Pipe, Interceptor, Middleware, ExceptionFilter, Custom Decorator 의 경우 nest-core에, 이외 모든 모듈을 각각 `nest-modules-<이름>` 라이브러리에서 정의합니다.

## 새 애플리케이션 / 라이브러리 생성하기

App의 경우 필요시, Dan(hwasurr)에게 말씀하세요.  
자세히 알아보고 싶은 분은 [nrwl/Nx](https://nx.dev/latest/react/getting-started/intro) 에서 알아볼 수 있습니다.

lib을 생성하고자 하는 경우, 다음 명령어를 사용해 구성할 수 있습니다.

```bash
# React library
yarn nx g @nrwl/react:lib <라이브러리 이름>
# Nestjs library
yarn nx g @nrwl/nest:lib <라이브러리 이름(ex. nest-modules-lib1)>
```

## 디펜던시 추가하기

Nx 이용을 통해 관리하므로, 각 폴더별로 따로 디펜던시를 관리하지 않습니다. (`package.json`, `node_modules`를 폴더별로 따로 가지지 않습니다.) 최상위 폴더에서 `yarn add`(개발용 디펜던시의 경우 `yarn add --dev`) 를 통해 디펜던시를 추가할 수 있습니다.

빌드시 알아서 필요한 디펜던시만 포함되도록 설계되어 있습니다.

## 개발 시작하기 (개발시, 앱 실행하기)

`yarn start <APP_NAME>`

ex.

- `yarn start api`
- `yarn start web`

### 상황 별 실행시켜야 하는 앱 (20221013 기준)
1. 판매자센터 개발 시
   - yarn start api
   - yarn start web-seller
   - yarn start mailer (판매자센터 회원가입 등 인증메일 발송이 필요한 경우)
   - yarn start api-realtime(실시간 알림 관련 개발이 필요한 경우)
2. 방송인센터 개발 시
   - yarn start api
   - yarn start web-broadcaster-center
   - yarn start mailer (방송인센터 회원가입 등 인증메일 발송이 필요한 경우)
   - yarn start api-realtime(실시간 알림, 방송인 현황판 관련 개발이 필요한 경우)
3. 크크쇼(소비자) 개발 시
   - yarn start api
   - yarn start web-kkshow
   - yarn start mailer (크크쇼 회원가입 등 인증메일 발송이 필요한 경우)
4. 관리자센터 개발 시
   - yarn start api
   - yarn start admin
   - yarn start api-realtime(실시간 알림 관련 개발이 필요한 경우)
5. 오버레이, 오버레이 송출 컨트롤러 개발 시
   - yarn start api
   - yarn start api-realtime
   - yarn start overlay
   - yarn start overlay-controller

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
- [apps/overlay](./apps/overlay/README.md)
- [apps/overlay-controller](./apps/overlay-controller/README.md)
- [apps/web](./apps/web/README.md)
- [libs/components-seller](./libs/components-seller/README.md)
- [libs/hooks](./libs/hooks/README.md)
- [libs/stores](./libs/stores/README.md)
- [libs/prisma-orm](./libs/prisma-orm/README.md)
- [libs/shared-types](./libs/shared-types/README.md)


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
로컬에서 테스트 필요시: 작업 완료된 `dev`로 진행 (푸쉬 불가, only PR)
테스트 완료시: `dev` -> `staging` (푸시 불가, only PR)  
배포시: `staging` -> `master` (푸시 불가, only PR)  
핫픽스 필요시: `hotfix` -> `master` (푸시 불가, only PR)

## 커밋메시지 가이드라인

더 읽기 쉬운 커밋 메세지를 장려하기 위해 커밋메시지 규칙을 구성합니다. 커밋 메시지를 강제하기 위해 commitlint 와 husky를 사용했습니다.
규칙은 간단하여 따르기 쉽습니다.

### 커밋 메시지 규칙

각 커밋 메시지는 **header**, **body**, **footer** 로 구성됩니다. header는 **type**, **scope**, **subject** 를 포함하도록 하는 특별한 규칙을 가집니다.

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

**header**는 필수입니다. **scope** 는 선택사항으로, 작성하거나 작성하지않을 수 있습니다.

github과 git과 관련한 여러 tool에서도 읽기 쉬운 커밋메시지를 유지하기 위해 모든 커밋 메시지의 각 라인은 100 자를 초과할 수 없습니다.

다음은 올바른 커밋 메시지 **header**에 대한 예시입니다.

```
feat: 개인 알림 기능 추가
fix(overlay): 화면에 오버레이가 뜨지 않는 버그 수정
docs(api): 방송인 서비스 사용법 문서 수정
```

### Revert

이전 커밋을 되돌리는 경우, 커밋메시지 header에 **revert** 라는 type을 명시해야 합니다. body에는 `This reverts commit <hash>.`가 포함되도록 작성하빈다. hash는 되돌릴 커밋의 SHA 입니다.

### Type

커밋 헤더의 Type은 코드 변경의 유형에 대한 정보입니다. 다음 중 하나가 명시되어야 합니다. (소문자만 허용합니다.)

- **feat**: 새로운 기능
- **fix**: 버그 수정
- **perf**: 성능 개선
- **db**: 데이터베이스 변경사항
- **improve**: 디자인 및 성능 개선
- **refactor**: 버그 수정 또는 새로운 기능이 아닌 코드 변경사항
- **style**: 코딩 스타일 변경사항 (prettier 룰변경, 사용하지 않는 import, 변수 제거 등)
- **test**: 테스트 파일 작성 또는 수정
- **docs**: 문서 변경사항 ( 주석만 추가되는 경우 포함 )
- **ci**: CI/CD 설정 파일 또는 스크립트 변경사항
- **chore**: 코드에 대한 변경사항이 없는 작업들(설정변경,패키지설치)
- **infra**: 코드로서의 인프라(IaC) 변경사항

### Subject

커밋 헤더의 Subject는 변경사항에 대한 간결한 설명을 포함해야 합니다.

- 명령형, 현재시제를 사용합니다.
  ```
  O oo 기능 변경
  X oo 기능 변경했습니다
  X oo 기능 변경 예정
  X oo 기능 변경했음
  ```
- 마침표는 사용하지 않도록 합니다.

### Body

body 부분은 변경 사항을 작업하게 된 배경을 기술하고, 이전의 상태와 비교하는 것이 좋습니다. 또한, 명령형, 현재 시제를 사용합니다.

```
- 유틸 라이브러리의 빌드 효율성 증대를 위한 변경
- <특정 함수>가 런타임에서 null 데이터를 확인하지 않아 <특정 기능>이 올바로 수행 되지 않는 점 수정
```
