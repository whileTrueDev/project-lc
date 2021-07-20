# hooks

이 라이브러리는 React hook 을 다룹니다.

주로, react-query를 이용한 데이터 요청 query, 데이터 조작 mutation 과 관련된 hook이 위치합니다.

## 설명

1. 작성한 hook은 모두 `hooks/src/index.ts` 에서 올바르게 export 해야합니다.

2. App 에서 사용할 때는 다음과 같이 불러와 사용합니다.

    ```tsx
    import { useSomething } from '@project-lc/hooks';

    function SomeComponent(): React.ReactElement {
        const { value } = useSomething();
        return (
            <div>{value}</div>
        )
    }
    ```

## 테스트

Run `nx test hooks` to execute the unit tests via [Jest](https://jestjs.io).
