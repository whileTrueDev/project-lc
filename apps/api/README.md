# API

이 애플리케이션은 Nest.js로 구성된 REST API 서버입니다.

## 설명

1. 모든 리소스는 src/app 아래에 작성됩니다. 예를 들어, hello 모듈이 필요하다면 `src/app/hello` 폴더에 `hello.module.ts`, `hello.service.ts` 를 두는 것 과 같은 모습입니다.
2. 기본적으로 빌드시 `ts`,`js` 파일만 빌드됩니다. 예외적으로 `assets` 폴더 아래의 컨텐츠는 `ts`,`js` 파일이 아니더라도 빌드에 포함됩니다.
3. 앱에 활용되는 모든 모듈은 `libs/nest-modules`에 작성하고, App 모듈에서 가져와 부착하는 식으로 사용합니다. 이와 관련된 자세한 내용은 [여기](./libs/nest-modules/README.md#설명) 에서 확인하세요.

