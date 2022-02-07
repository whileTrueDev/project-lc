import {
  CacheInterceptor,
  CACHE_KEY_METADATA,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { join } from 'path';

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

    // @CacheWithoutAuth(true) 데코레이터로 auth 상관없이 캐싱하도록 하지 않은 경우
    // 인증정보와 함께 캐싱해야 하는 경우
    if (req.user) {
      const userIdentifier = `${req.user.type}:${req.user.id}`;
      result += userIdentifier;
    }

    // @CacheKey() 데코레이터로 캐시 키를 입력한 경우
    if (cacheKeyMetadata) {
      result = join(result, cacheKeyMetadata);
    }

    const url = super.trackBy(context);
    result = join(result, url);
    if (!result) result = url;

    // TODO: 커밋시 삭제
    console.log('cacheKey result: ', result);

    return result;
  }
}
