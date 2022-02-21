import { CacheModuleOptions, CacheOptionsFactory, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisCacheStore from 'cache-manager-ioredis';

export const defaultCacheTTL = 10;

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions | Promise<CacheModuleOptions> {
    const nodeEnv = this.configService.get('NODE_ENV');
    const cacheClusterHost = this.configService.get('CACHE_REDIS_URL');

    const cacheOptions: CacheModuleOptions = {
      isGlobal: true,
      store: redisCacheStore,
      clusterConfig: {
        nodes: [{ host: 'localhost', port: 6379 }],
        options: { ttl: defaultCacheTTL },
      },
    };
    if (['production', 'test'].includes(nodeEnv)) {
      // 테스트, 프로덕션 환경
      const [host, port] = cacheClusterHost.split(':');
      const clusterConfig = {
        nodes: [{ host, port: port || 6379 }],
        options: { ttl: defaultCacheTTL },
      };
      cacheOptions.clusterConfig = clusterConfig;
    }

    return cacheOptions;
  }
}
