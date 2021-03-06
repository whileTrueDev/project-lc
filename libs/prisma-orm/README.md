# prisma-orm

이 라이브러리는 라이브커머스플랫폼의 주 데이터베이스 연결 및 데이터베이스 활용을 위한 라이브러리입니다.

[prisma](https://www.prisma.io/) 를 ORM으로 사용합니다.

## Dev 환경에서의 Prisma ORM 사용법

Dev 환경 데이터베이스는 각자 로컬에 설치하여 사용하도록 합니다. Docker MySQL이미지 활용하셔도 무방합니다.

1. **Prisma 소스로 스키마 관리**  

   새로운 테이블 및 컬럼의 추가는 모두 `libs/prisma-orm/prisma/schema.prisma`파일에 PSL(Prisma Schema Language)로 작성됩니다. `schema.prisma` 파일은 [Single Source of Truth](https://ko.wikipedia.org/wiki/%EB%8B%A8%EC%9D%BC_%EC%A7%84%EC%8B%A4_%EA%B3%B5%EA%B8%89%EC%9B%90)입니다. 변경사항 및 새로운 엔터티를 `schema.prisma` 구성했더라도, 해당 변경사항은 연결된 데이터베이스에 곧바로 반영되지 않습니다.

2. **데이터베이스에 스키마 반영하기**

    데이터베이스에 schema.prisma 의 사항을 반영하기 위한 작업은 크게 두 가지로 나눌 수 있습니다. 한 가지는 마이그레이션 파일을 생성하며 변경 사항을 반영하는 것과 다른 한 가지는 마이그레이션 파일을 생성하지 않은 채 변경사항을 반영하는 것입니다.

    1. 마이그레이션 파일을 생성하지 않고 변경사항 반영하기

        ```bash
        yarn nx run prisma-orm:local-push
        ```

        앞의 명령어는 마이그레이션 파일을 생성하지 않고, schema.prisma 의 변경사항을 데이터베이스에 반영합니다. 이는 로컬개발환경에서 데이터베이스를 프로토타이핑하는 데에 도움을 줍니다. 주의할 점은 마이그레이션 파일이 생성되지 않으므로, 타 팀원이 해당 변경사항을 적용하지 못할 수 있다는 것입니다. 따라서 push 기능은 언제나 "로컬 환경에서 빠르게 개발하기 위함"임을 기억하고, 풀리퀘스트 이전에는 언제나 아래 2번의 방법으로 마이그레이션 파일을 생성해 주어야 합니다.

    2. 마이그레이션 파일을 생성하며 변경사항 반영하기

        ```bash
        yarn nx run prisma-orm:migrate-dev --name <MIGRATION_NAME>
        ```

        앞의 명령어는 SQL 마이그레이션 파일을 생성함과 동시에, 해당 마이그레이션 SQL 파일을 연결된 데이터베이스에 실행합니다. 이를 통해 데이터베이스 테이블을 생성하는 작업이 완료되었습니다.

        만약 데이터베이스에 마이그레이션 작업을 실행하지 않고, 마이그레이션 파일만 만들고 싶은 경우 다음 명령어를 사용할 수 있습니다.

        ```bash
        yarn nx run prisma-orm:migrate-create-only
        ```

        실행한 마이그레이션 작업을 취소하고자 한다면 다음 명령어를 실행시킬 수 있습니다.

        ```bash
        yarn nx run prisma-orm:migrate-reset
        ```

    **주의**  
    `yarn nx run prisma-orm:migrate-dev`, `yarn nx run prisma-orm:migrate-reset`, `yarn nx run prisma-orm:local-push` 명령어는 개발환경에서만 사용합니다. 절대 프로덕션 마이그레이션 작업에 해당 명령어를 사용하지 않습니다.

    **참고**  
    prisma 공식문서와 다르게, yarn nx run 으로 실행시키는 이유는 사용될 수 있는 몇 가지 prisma 명령어를 개발 환경에서 사용될 수 있는 몇가지 명령어로 다시 정리해두었기 때문입니다. 또한 nx만의 구조 때문에 --schema 옵션을 통해 파일을 명시해주어야만 하므로, 해당 옵션까지 모두 포함시켜 정리해뒀습니다. 날것의 명령어를 보고싶은 분은 `workspace.json` 의 `project` -> `prisma-orm` -> `targets` 에서 각 명령어를 확인할 수 있습니다.

3. **Prisma Client 생성하기**

    개발환경에서 사용될 수 있는 위의 `yarn nx run prisma-orm:local-push` 와 `yarn nx run prisma-orm:migrate-dev` 명령어는 마이그레이션 작업을 실행함과 동시에 자동적으로 Prisma Client를 생성하는 작업까지 실행합니다.

    위와 같은 상황이 아닌 경우, 다음 명령어로 Prisma Client를 생성합니다. Prisma Client는 데이터베이스에 접근할 수 있는 엔진을 탑재한 업격히 타입정의된 클래스입니다. 이 명령어의 작업은 Prisma Client를 함과 동시에 input과 arguments에 대한 타입정의도 함께 생성합니다.

    ```bash
    yarn nx run prisma-orm:prisma-generate
    ```

    해당 명령어에 데이터베이스 doc을 함께 생성하도록 플러그인을 추가해두었습니다. 명령어 실행 이후에는 `libs/prisma-orm/prisma/docs` 폴더가 생성되며, 해당 폴더의 `index.html` 파일을 열면, DB 레퍼런스에 대한 문서를 확인할 수 있습니다.

4. **Prisma Client를 통해 데이터 접근하기**

    1. `apps`의 `app.module.ts` 에서 전역모듈로 설정한 PrismaModule을 import합니다. 이 작업은 대개 이미 설정되어 있습니다.
    2. 데이터베이스에 대한 접근은 service 레이어에서만 접근하도록 합니다. service 파일에서 데이터베이스 접근이 필요한 경우, Nestjs에 의해 디펜던시 인젝션된 PrismaService를 constructor 에서 가져와 사용합니다.

    ```ts
    // apps/../app.module.ts
    import { Module } from '@nestjs/common';

    @Module({
        imports: [PrismaModule, ...,],
    })
    export class AppModule {}
    ```

    ```ts
    // nest-modules-*/../some.service.ts
    import { PrismaService } from '@project-lc/prisma-orm';
    import { Prisma, Post } from '@prisma/client';

    @Injectable()
    export class SomeService {
        // prisma service dependency injection
        constructor(private readonly prisma: PrismaService) {}

        findPosts(params: {
            skip?: number;
            take?: number;
            cursor?: Prisma.UserWhereUniqueInput;
            where?: Prisma.UserWhereInput; // 자동 생성된 Input타입 사용
            orderBy?: Prisma.UserOrderByInput;
        }): Promise<Post[]> { // 자동생성된 엔터티 타입정의를 참조
            // 자동 생성된 DB client를 통해 DB에 접근
            return this.prisma.posts.findMany(params);
        }
    }
    ```

    `@prisma/client`는 위 3번 단락에서 설명한 `generate` 명령어 통해 자동으로 생성된 타입정보가 있는 패키지입니다. `schema.prisma` 스키마 파일 `Post` 에 대한 정보가 있다고 가정하였을 때, 생성된 `@prisma/client` 패키지에는 `Post`가 타입스크립트 인터페이스로 자동으로 정의되어 있습니다.

    **주의**  
    자동으로 생성된 `@prisma/client` 패키지에서 곧바로 PrismaClient를 가져와 인스턴스화 시켜 사용하지 않고, PrismaService를 사용하시기를 권장합니다. (PrismaClient는 인스턴스화 시킬때마다 개별적으로 connecitonPool을 만들어 사용합니다.) 불가피하게 PrismaClient를 가져와 인스턴스화 하여 사용하여야 하는 경우, `$connect`와 `$disconnect`를 올바른 상황에 사용하셔야 합니다. 그렇지 않은 경우, 데이터베이스 connection이 정상적으로 종료되지 않을 수 있습니다.

    prismaClient의 CRUD 방법에 대한 API 레퍼런스는 [여기](https://www.prisma.io/docs/concepts/components/prisma-client/crud)에서 확인할 수 있습니다.


5. migrate 실패시 롤백하기

    ```bash
    yarn nx run prisma-orm:migrate-rollback --args="--target=<마이그레이션이름>"
    ```