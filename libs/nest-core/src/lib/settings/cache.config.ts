import { CacheModuleOptions } from '@nestjs/common';
import * as redisCacheStore from 'cache-manager-ioredis';

export const cacheConfig: CacheModuleOptions = {
  store: redisCacheStore,
  host: 'localhost',
  port: 6379,
  isGlobal: true,
};
