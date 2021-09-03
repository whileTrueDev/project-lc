# Socket

이 애플리케이션은 라이브커머스 배너 송출을 위한 websocket 서버입니다.

Nest.js로 Websocket 서버를 구현합니다.

## 설명

먼저, [Nest.js + Socket.io](https://docs.nestjs.com/websockets/gateways) 에 대한 정보를 확인하세요.

1. 모든 모듈은 nest-modules 라이브러리에 구현됩니다.
2. views 폴더에 작성한 view 파일은 모두 빌드시 포함되도록 설정해 두었습니다. 즉, 따로 browserify 등을 통해 dist 폴더에 넣는 등의 행위를 할 필요 없습니다.
