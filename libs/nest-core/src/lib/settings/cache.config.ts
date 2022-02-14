import { CacheModuleOptions, CacheOptionsFactory, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisCacheStore from 'cache-manager-ioredis';

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions | Promise<CacheModuleOptions> {
    const nodeEnv = this.configService.get('NODE_ENV');
    const cacheClusterHost = this.configService.get('CACHE_REDIS_URL');

    const cacheOptions: CacheModuleOptions = {
      isGlobal: true,
      store: redisCacheStore,
      host: 'localhost',
      ttl: 5,
    };

    if (
      ['production', 'test'].includes(nodeEnv) &&
      cacheClusterHost &&
      cacheClusterHost.includes(':')
    ) {
      const [host, port] = cacheClusterHost.split(':');
      cacheOptions.host = host;
      cacheOptions.port = port;
    }

    return cacheOptions;
  }
}
