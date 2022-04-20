import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { Cache } from 'cache-manager';

@Injectable()
export class OrderService extends ServiceBaseWithCache {
  #ORDER_CACHE_KEY = 'order';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  /** 주문생성 */

  /** 주문목록조회 */

  /** 개별주문조회 */

  /** 주문수정 */

  /** 주문 삭제 */
}
