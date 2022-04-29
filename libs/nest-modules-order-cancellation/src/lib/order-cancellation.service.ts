import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { Cache } from 'cache-manager';

@Injectable()
export class OrderCancellationService extends ServiceBaseWithCache {
  #ORDER_CANCEL_CACHE_KEY = 'order-cancellation';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }
}
