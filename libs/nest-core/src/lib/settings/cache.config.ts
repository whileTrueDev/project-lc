import { CacheModuleOptions, CacheOptionsFactory, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisCacheStore from 'cache-manager-ioredis';
import Redis from 'ioredis';

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions | Promise<CacheModuleOptions> {
    const nodeEnv = this.configService.get('NODE_ENV');
    let redisCacheClient: Redis.Cluster | Redis.Redis;
    if (['production', 'test'].includes(nodeEnv)) {
      const cacheClusterHost = this.configService.get('CACHE_REDIS_URL');
      redisCacheClient = new Redis.Cluster([cacheClusterHost]);
    } else {
      redisCacheClient = new Redis('127.0.0.1:6379');
    }

    return {
      ttl: 5,
      store: redisCacheStore,
      redisInstance: redisCacheClient,
    };
  }
}
