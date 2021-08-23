# nest-modules

이 라이브러리는 nestjs 애플리케이션 간 동시에 활용될 수 있는 module들에 대한 라이브러리입니다.

## 설명

이 라이브러리에서는 nestjs 애플리케이션에서 사용될 수 있는 모듈과 exception filter, decorator, guard, middleware, interceptor, pipe 등을 정의하는 라이브러리입니다.


1. 모든 리소스는 `src/lib` 아래에 작성됩니다. 예를 들어, hello 모듈이 필요하다면 `src/lib/hello` 폴더에 `hello.module.ts`, `hello.service.ts` 를 두는 것 과 같은 모습이 될 것입니다.
2. exception filter, decorator, guard, middleware, interceptor, pipe 는 모두 `src/lib/_nest-units` 아래에 작성됩니다.
3. 기본적으로 빌드시 `ts`,`js` 파일만 빌드됩니다. 예외적으로 `assets` 폴더 아래의 컨텐츠는 `ts`,`js` 파일이 아니더라도 빌드에 포함됩니다.

## 개발 편의

### generator의 사용

- module 생성

    ```bash
    yarn nx g @nrwl/nest:module lib/<모듈명> -p nest-modules
    ```

- service 생성

    ```bash
    yarn nx g @nrwl/nest:service lib/<서비스명> -p nest-modules
    ```

- controller 생성

    ```bash
    yarn nx g @nrwl/nest:controller lib/<컨트롤러명> -p nest-modules
    ```


## 테스트

Run `nx test nest-modules` to execute the unit tests via [Jest](https://jestjs.io).
