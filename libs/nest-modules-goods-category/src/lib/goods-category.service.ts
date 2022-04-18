import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { Cache } from 'cache-manager';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class GoodsCategoryService extends ServiceBaseWithCache {
  #GOODS_CATEGORY_CACHE_KEY = 'goods-category';
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }
}
