# Project-lc

project-lc의 lc는 live commerce의 앞글자만 따왔습니다.

## 프로젝트 구조 및 프로젝트 관리

프로젝트는 [Nx](https://nx.dev) 환경 하에서 개발 진행합니다.
Nx는 monorepo환경을 효율적이고 효과적으로 구성할 수 있도록 돕습니다. Jest, Cypress, ESLint, Storybook 등 여러 많은 툴과 React, Next, Nest, Angular 등의 애플리케이션을 지원합니다.

Nx는 모듈식 코드 단위를 유지 및 관리하고, 이들 간의 종속성을 이해하는 코어를 기반으로 구현되었습니다. 이러한 dependency를 이해하는 코어를 바탕으로 한 캐시를 통해, 기존 monorepo와 달리 CI 파이프라인에서 속도 저하를 최소화합니다.

Nx에서는 코드 모듈의 종류를 Application과 Library 두 가지로 나눕니다. `/apps` 폴더에는 애플리케이션 프로젝트가 위치합니다. `/libs` 폴더에는 라이브러리 프로젝트가 위치합니다. 

가능한 `/apps` 폴더 내에 위치한 애플리케이션 코드를 작은 크기로 유지하는 것이 좋습니다. 코어 사용 부분은 대부분 `/libs` 폴더에 위치한 라이브러리 프로젝트에서 구현되고 애플리케이션에서는 라이브러리 코드를 가져와 사용합니다.

### apps

### libs

### 


## Generate a library

Run `nx g @nrwl/react:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@project-lc/mylib`.

## Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.



## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
