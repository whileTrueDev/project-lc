import {
  CacheInterceptor,
  CACHE_KEY_METADATA,
  CACHE_TTL_METADATA,
  CallHandler,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { join } from 'path';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  protected trackBy(context: ExecutionContext): string {
    // 캐싱할 수 없는 경우
    if (!this.isRequestCacheable(context)) return undefined;

    // HTTP 프로토콜이 아닌 경우
    const { httpAdapter } = this.httpAdapterHost;
    const isHttpApp = httpAdapter && !!httpAdapter.getRequestMethod;
    if (!isHttpApp) return undefined;

    // Cache 관련된 메타데이터 데코레이터 정보 찾기
    const { reflector } = this;
    // 라우트 핸들러에서 입력한 cache key
    const cacheKeyMetadata: string | undefined = reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    const req = context.switchToHttp().getRequest<Request>();
    let result = '';

    // 인증정보와 함께 캐싱해야 하는 경우
    if (req.user) {
      const userIdentifier = `${req.user.type}:${req.user.id}`;
      result += userIdentifier;
    }

    // @CacheKey() 데코레이터로 캐시 키를 입력한 경우
    if (cacheKeyMetadata) {
      result = join(result, cacheKeyMetadata);
    }

    result = join(result, req.originalUrl);
    if (!result) result = req.originalUrl;

    return result;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const key = this.trackBy(context);
    const ttlValueOrFactory =
      this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ?? null;

    if (!key) {
      return next.handle();
    }
    try {
      const value = await this.cacheManager.get(key);
      if (value === null || value === undefined) {
        return of(value);
      }
      const ttl =
        typeof ttlValueOrFactory === 'function'
          ? await ttlValueOrFactory(context)
          : ttlValueOrFactory;
      return next.handle().pipe(
        tap((response) => {
          if (response) {
            const args =
              ttl === null || ttl === undefined
                ? [key, response]
                : [key, response, { ttl }];
            this.cacheManager.set(...args);
          }
        }),
      );
    } catch {
      return next.handle();
    }
  }
}
