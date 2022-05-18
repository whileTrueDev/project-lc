# 캐시 인터셉터

### 캐시 인터셉터의 의도

1. GET 요청에 대한 응답을 캐시하여 데이터베이스 접근을 최소화
2. POST, PATCH, PUT, DELETE 요청에 대한 응답시 연관된 캐시들을 초기화하여 변경사항이 즉시 반영되지 않는 현상을 해결

### 캐시 초기화 방식 변경 의도

1. [기존 캐시 초기화 방식](./prev-http-cache.interceptor.md)은 service의 비즈니스로직에서 원하는 상황에서 캐시를 초기화하는 기능을 구현하는 방식이었음. 이를 위해 ServiceBaseWithCache 클래스를 상속받아야 했고, 특정 상황에 캐시 초기화하는 코드를 삽입했어야 했음.
2. 이 방식은 비즈니스로직이 더 복잡해지는 결과를 불러왔음.
3. 또한 캐시를 제거하는 작업은 실제 기능이 어떻게 구현될 것인지와는 비교적 관계가 없음. 따라서 비즈니스로직에서 따로 떨어져 나와 관리될 수 있어야 할 것으로 보임.
4. 캐시 초기화는 대부분 생성,수정,삭제시 발생함. 이는 Controller에서 관리하는 HTTP 요청 메서드 POST, PATCH/PUT, DELETE 와 매칭될 수 있음.
5. 또한 특정 Service에서 관리하는 특정 리소스의 생성,수정,삭제 에 따라 초기화될 캐시는 단순히 해당 리소스에만 의존적이지 않음. A를 생성했을 떄 A리소스에 대한 캐시뿐만아니라 A와 연관이 있는 B, C 캐시도 초기화되어야 할 경우가 많음.

### 캐시 초기화 방식 변경

- 캐시 초기화에 대한 의존성 관리 주체를 Service가 아닌 Controller로 변경.
- Service에서 비즈니스 로직 사이에서 캐시를 초기화하는 절차를 구현하지 않고, Controller의 라우트 핸들러 메서드에서 의존적인 캐시 키를 지정하기만 하고, 실제 캐시 초기화는 `HttpCacheInterceptor`에 의해 자동으로 진행되도록 변경

## 사용 방법

`HttpCacheInterceptor` 는 연결된 redis 클러스터에 서버단 캐시를 등록하거나 초기화하는 데에 사용합니다.

interceptor는 클라이언트로부터 서버로의 요청, 서버로부터 클라이언트로의 응답 가운데 로직을 끼워넣는 방법을 제공합니다.

클라이언트 사이드 요청 ---> 인터셉터 ---> 서버의 응답 ---> 인터셉터 ---> 클라이언트에게 응답 전송

### 캐시의 등록

- `@UseInterceptors(HttpCacheInterceptor)` 가 명시된 `@Get()` 메서드 라우트 핸들러의 응답을 캐시로 등록합니다.
- `@UseInterceptors(HttpCacheInterceptor)` 데코레이터는 라우트 핸들러 메서드와 컨트롤러 클래스에 적용할 수 있습니다.
- `@UseInterceptors(HttpCacheInterceptor)` 데코레이터를 컨트롤러 클래스애 적용할 경우 해당 컨트롤러의 모든 `@Get()` 메서드 라우트 핸들러의 응답을 캐시로 등록합니다.
- `@CacheTTL()` 데코레이터를 통해 라우트 핸들러에 Time To Live 시간을 설정하지 않는 이상 캐시는 기본 **10초** 유지됩니다.
- `@CacheKey()` 데코레이터를 통해 라우트 핸들러에 커스텀 캐시 키를 설정하지 않는 이상 요청 URL이 그대로 캐시 키로 적용됩니다. 이 떄, 쿼리스트링도 키로 포함됩니다.

### 캐시의 초기화

- `@CacheClearKeys(...cacheKeys)` 데코레이터가 명시된 `@Post()`, `@Patch()`, `@Put()`, `@Delete()` 라우트 핸들러가 `null`, `undefined` 가 아닌 값을 응답할 때, `@CacheClearKeys()` 데코레이터에 명시된 `cacheKeys` 각각에 대한 캐시를 모두 초기화합니다.
- `@CacheClearKeys(...cacheKeys)` 데코레이터는 라우트 핸들러 메서드와 컨트롤러 클래스에 적용할 수 있습니다. 둘 모두 명시하는 경우 캐시키 목록은 병합됩니다. [1,2], [1,3] -> [1,2,3]
- `@CacheClearKeys(...cacheKeys)` 데코레이터는 `@UseInterceptors(HttpCacheInterceptor)` 데코레이터가 명시된 컨트롤러, 메서드 핸들러에서만 작동합니다. 따라서 캐시를 등록하지 않고 초기화하기만 하는 경우라도 `@UseInterceptor(HttpCacheInterceptor)`가 컨트롤러 또는 메서드핸들러에 적용되어야 합니다.

## 예시

- `@Controller()` 클래스에 `@UseInterceptors(HttpCacheInterceptor)` 데코레이터를 명시하여 모든 GET 메서드 응답 값을 캐시하는 경우
- 등록, 수정, 삭제시 다른 여러 키에 대한 캐시가 초기화되어야 하는 경우

```ts
import { Controller, Delete, Get, Patch, Post, UseInterceptors } from '@nestjs/common';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';

@Controller('some-endpoint')
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('some-endpoint')
export class SomeController {
  /** 모두 조회 */
  @Get()
  findAll(): Promise<SomeItemItem> {
    return this.service.findAll();
  }

  /** 생성 */
  @Post()
  @CacheClearKeys('other-cache-key', 'another-cache-key')
  create(
    @Body(new ValidationPipe({ transform: true })) dto: CreateDto,
  ): Promise<SomeItem> {
    return this.service.create(dto);
  }

  /** 수정 */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true })) dto: UpdateDto,
  ): Promise<SomeItem> {
    return this.service.update(id, dto);
  }

  /** 식제 */
  @Delete(':id')
  @CacheClearKeys('other-cache-key', 'another-cache-key')
  remove(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.service.remove(id);
  }
}
```

### 설명

- `@Controller()` 데코레이터가 명시된 `SomeController` 클래스에 `HttpCacheInterceptor` 가 적용되었으므로, 해당 컨트롤러의 모든 `@Get()` 라우트 핸들러 응답값을 캐시로 등록합니다.
- `@CacheTTL()` 데코레이터를 `@Get()` 메서드핸들러에 명시하지 않았으므로 캐시는 유지 시간 기본값인 10초간 유지됩니다.
- `SomeController` 에 `@CacheClearKeys('some-endpoint')` 가 명시되었으므로 `@Post() create`, `@Patch(':id') update`, `@Delete(':id') remove` 라우트 핸들러 응답시 `some-endpoint` 키를 가진 캐시를 초기화합니다.
- `@Post() create` 라우트 핸들러와 `@Delete(:id) remove` 에 `@CacheClearKeys('other-cache-key', 'another-cache-key')` 가 명시되었으므로 해당 라우트 핸들러가 `undefined`, `null` 이외의 값을 응답할 시 `some-endpoint` 이외에도 `other-cache-key`, `another-cache-key` 키를 가진 캐시도 모두 초기화합니다.

## 예시 2

- 특정 `@Get()` 라우트 핸들러에만 `@UseInterceptors(HttpCacheInterceptor)` 데코레이터를 명시하는 경우 (`@Controller()` 클래스에 캐시인터셉터를 구성하지 않은 경우)
- 위 경우에서 `@Post()`, `@Patch()`, `@Put()`, `@Delete()` 라우트 핸들러에서 특정 캐시를 초기화하는 경우

```ts
import { Controller, Delete, Get, Patch, Post, UseInterceptors } from '@nestjs/common';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';

@Controller('some-endpoint')
export class SomeController {
  /** 모두 조회 */
  @Get()
  @UseInterceptors(HttpCacheInterceptor)
  findAll(): Promise<SomeItemItem> {
    return this.service.findAll();
  }

  /** 캐시하지 않는 GET응답이 존재 */
  @Get()
  findSomething(): Promise<Something> {
    return this.service.findSomething();
  }

  /** 생성 */
  @Post()
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('some-endpoint', 'other-cache-key', 'another-cache-key')
  create(
    @Body(new ValidationPipe({ transform: true })) dto: CreateDto,
  ): Promise<SomeItem> {
    return this.service.create(dto);
  }
}
```
