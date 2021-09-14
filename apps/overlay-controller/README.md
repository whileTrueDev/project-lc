# Overlay controller

이 애플리케이션은 라이브커머스 배너 송출 컨트롤을 위한 websocket 서버입니다.

Nest.js로 WebSocket 서버를 구현합니다.

## 설명

먼저, [Nest.js + Socket.io](https://docs.nestjs.com/weboverlays/gateways) 에 대한 정보를 확인하세요.

템플릿 엔진 화면 렌더링에 관해서는 https://docs.nestjs.com/techniques/mvc 에서 정보를 확인하세요.

1. 모든 모듈은 libs/nest-modules 아래애 모두 구현됩니다.
2. views 폴더에 작성한 view 파일은 모두 빌드시 포함되도록 설정해 두었습니다.