# nest-modules-auth

This library was generated with [Nx](https://nx.dev).

회원가입, 로그인(토큰발급), 본인인증, 소셜로그인 관련 요청을 처리하는 모듈입니다

/auth : 이메일 로그인, 로그아웃, 로그인한 유저정보 조회, 인증코드 

/social : 소셜로그인 콜백라우터, 소셜로그인 관련
    /strategy/* : 각 소셜서비스 별 패스포트 strategy
    /platform-api/* : 각 소셜서비스 별 토큰 관련 작업 함수 등

## Running unit tests

Run `nx test nest-modules-auth` to execute the unit tests via [Jest](https://jestjs.io).
