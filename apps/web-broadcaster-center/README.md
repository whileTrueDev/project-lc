# Web

Next.js로 구현된 방송인센터 웹 프론트앤드 서버입니다.

## 설명

1. `react-query`를 통한 원격 데이터 조회 및 상호작용은 libs/hooks 에 정의한 hook을 사용합니다.
2. `zustand`를 통한 상태관리는 `libs/stores` 에서 정의한 store를 사용합니다.
3. pages의 레이아웃을 다루는 컴포넌트를 제외한 하위 컴포넌트는 모두 `/libs/components-*` 에서 정의한 컴포넌트를 사용합니다.
