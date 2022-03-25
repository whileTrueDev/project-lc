import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { Cache } from 'cache-manager';

@Injectable()
export class ManualService extends ServiceBaseWithCache {
  #MANUAL_CACHE_KEY = 'manual';
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }
}
