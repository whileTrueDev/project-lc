import {
  CacheInterceptor,
  CACHE_KEY_METADATA,
  CACHE_TTL_METADATA,
  CallHandler,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Redis } from 'ioredis';
import { join } from 'path';
import { delay, from, Observable, of, tap } from 'rxjs';
import { CACHE_CLEAR_KEY_METADATA } from '../constants/cache-clear-key';

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
    // eslint-disable-next-line prefer-destructuring
    const reflector: Reflector = this.reflector;
    // POST, PATCH, PUT, DELETE 메소드에 대해 @CacheClearKeys() 에 의한 캐시 해제 처리
    const req = context.switchToHttp().getRequest<Request>();
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
      // 핸들러또는 클래스에 @CacheClearKeys() 데코레이터로 적용한 clear할 캐시키 목록 가져오기
      const clearCacheKeys =
        reflector.getAllAndMerge<string[]>(CACHE_CLEAR_KEY_METADATA, [
          context.getHandler(),
          context.getClass(),
        ]) ?? null;
      if (!clearCacheKeys) return next.handle();

      return next.handle().pipe(
        tap((resData) => {
          if (this.isNil(resData)) return of(undefined);
          const cacheKeys = [...new Set(clearCacheKeys)];
          return from(this._clearCaches(cacheKeys));
        }),
        // tap nextFunction 이 끝나지 않아도 응답이 진행되어
        // 재 요청시 stale 데이터가 반환되는 현상이 있음.
        // 이 현상에 대한 임시 처리 : 0.5초 딜레이 추가
        delay(500),
      );
    }

    const key = this.trackBy(context);
    // 핸들러에 @CacheTTL() 데코레이터로 적용한 ttl 값 가져오기
    const ttlValueOrFactory =
      reflector.get(CACHE_TTL_METADATA, context.getHandler()) ?? null;

    if (!key) return next.handle();

    try {
      const value = await this.cacheManager.get(key);
      if (!this.isNil(value)) return of(value);

      const ttl =
        typeof ttlValueOrFactory === 'function'
          ? await ttlValueOrFactory(context)
          : ttlValueOrFactory;
      return next.handle().pipe(
        tap((response) => {
          if (!this.isNil(response)) {
            const args = this.isNil(ttl) ? [key, response] : [key, response, { ttl }];
            this.cacheManager.set(...args);
          }
        }),
      );
    } catch {
      return next.handle();
    }
  }

  private isNil = <T = any>(v: T): boolean => {
    return v === null || v === undefined;
  };

  /**
   * 받은 캐시키에 해당하는 캐시 데이터를 삭제합니다. 해당 캐시키가 포함되는 모든 key에 대해 삭제합니다.
   * @param cacheKey 삭제할 캐시 키
   */
  private async _clearCaches(cacheKeys: string[]): Promise<boolean[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const client: Cluster = await this.cacheManager.store.getClient();
    const redisNodes = client.nodes() as Redis[];

    return Promise.all(
      cacheKeys.map(async (cacheKey) => {
        const _keys: boolean[][] = await Promise.all(
          redisNodes.map(async (redis) => {
            const k = await redis.keys(`*${cacheKey}*`);
            return Promise.all(k.map((_k) => !!redis.del(_k))).catch((err) => {
              console.error(`An error occurred during clear caches - ${cacheKey}`, err);
              return [false];
            });
          }),
        );
        const results = _keys.flat();
        return results.every((r) => !!r);
      }),
    );
  }
}
