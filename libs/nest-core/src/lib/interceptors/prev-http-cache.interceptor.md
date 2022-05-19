## 기존 캐시 등록 및 캐시 초기화 방식

- 컨트롤러에서 HttpCacheInterceptor 인터셉터를 통해 캐시 등록에 대해 제어.
- 또는 특정 @Get() 라우트 핸들러 메서드에서 인터셉터를 통해 캐시 등록을 제어.

```ts
// something.controller.ts
import { Controller, Delete, Get, Patch, Post, UseInterceptors } from '@nestjs/common';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';

@Controller('some-endpoint')
@UseInterceptors(HttpCacheInterceptor)
export class SomeController {
  constructor(private readonly service: SomeService) {}
  /** 모두 조회 */
  @Get()
  findAll(): Promise<SomeItemItem> {
    return this.service.findAll();
  }

  /** 생성 */
  @Post()
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
  remove(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.service.remove(id);
  }
}
```

- 서비스에서 캐시 초기화를 제어.
- 캐시를 제어하는 기능이 미리 포함되어 있는 ServiceBaseWithCache 클래스를 상속받아 사용.

```ts
// something.service.ts

@Injectable()
export class SomeService extends ServiceBaseWithCache {
  #SOME_CACHE_KEY = 'some-endpoint';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  public async create(dto: SomeDto): Promise<Something> {
    // 비즈니스 로직
    const created = await this.prisma.something.create();
    ...

    // ServiceBaseWithCache 에게 상속받은 캐시 초기화 기능 사용
    await this._clearCaches(this.#SOME_CACHE_KEY);
    return created;
  }

  public async delete(dto: SomeDeleteDto): Promise<Something> {
    // 비즈니스 로직
    const deleted = await this.prisma.something.delete();
    ...

    // ServiceBaseWithCache 에게 상속받은 캐시 초기화 기능 사용
    await this._clearCaches(this.#SOME_CACHE_KEY);
    // 다른 의존적인 캐시를 초기화할 필요가 있는 경우
    await this._clearCaches('some-other-cache-key')
    await this._clearCaches('some-another-cache-key')
    return deleted;
  }
}
```

변경된 캐시 초기화 방식은 [HttpCacheInterceptor 에 대한 설명페이지](./http-cache.interceptor.md) 에서 확인할 수 있음.
