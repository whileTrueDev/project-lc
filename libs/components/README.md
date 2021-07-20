# components

리액트 컴포넌트는 여러 리액트 앱에서 함께 사용될 가능성이 있으므로, 독립적인 라이브러리에서 다루도록 취급합니다. (예를 들면, 메인 페이지와 동일한 view를 갖는 관리자 페이지) 따라서, 각 컴포넌트는 독립적으로 활용될 수 있도록 설계하여야 합니다.

'컴포넌트'의 단위는 UI 라이브러리에서 제공하는 것과 그 정의를 같이합니다.

## 설명

1. `page` 단위는 App에서 작성하고, 나머지 단위는 모두 components 라이브러리 내에 작성됩니다.
2. 상하 관계를 가지는 컴포넌트의 경우 하위 폴더를 생성하여 작업할 수 있으나, 되도록이면 각 컴포넌트를 세부적 단위로 쪼갠 채, `pages` 내에서 가져와 사용하도록 하기를 권장합니다.
3. react를 위한 컴포넌트가 이 라이브러리의 주를 이루며, react-native 컴포넌트는 `ExampleComponent.native.ts`와 같이 생성할 수 있습니다.
4. 작성한 컴포넌트는 모두 `components/src/index.ts` 에서 올바르게 export 해야합니다.
5. App 에서 사용할 때는 다음과 같이 불러와 사용합니다.

    ```tsx
    import { SomeComponent } from '@project-lc/components';

    function SomeComponent(): React.ReactElement {
        return (
            <SomeComponent />
        )
    }
    ```

6. 컴포넌트별로 [storybook](https://storybook.js.org/)을 작성하면 더욱 좋습니다.
7. UI 라이브러리에서 가져온 컴포넌트를 components 라이브러리에 굳이 재작성할 필요는 없습니다. 커스터마이징된 UI라이브러리 컴포넌트가 따로 필요한 경우에는 현재 라이브러리에 작성할 수 있습니다.

## 테스트

Run `nx test components` to execute the unit tests via [Jest](https://jestjs.io).
