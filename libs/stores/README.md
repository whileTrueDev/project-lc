# stores

이 라이브러리는 리액트 애플리케이션을 위한 상태관리 스토어에 대한 라이브러리입니다. [zustand](https://github.com/pmndrs/zustand) store를 모두 여기에 작성합니다.

## 설명

zustand는 작은 단위의 여러개의 store로 상태를 관리할 수도, 하나의 store에서 모든 상태를 처리할 수도 있습니다. 새로운 store의 생성에 대한 판단은 store가 다루는 상태의 의존성을 잘 판단하여 진행합니다.

**주의**  
백엔드로부터 요청을 통해 받아온 원격 데이터는 모두 react-query를 통해서 관리합니다. 따라서 zustnad 상태에 axios등을 통해 받아온 백엔드 데이터 상태를 추가하지 않도록합니다.

## 테스트

Run `nx test stores` to execute the unit tests via [Jest](https://jestjs.io).
