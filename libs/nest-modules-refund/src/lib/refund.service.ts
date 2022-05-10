import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { Cache } from 'cache-manager';

@Injectable()
export class RefundService extends ServiceBaseWithCache {
  #REFUND_CACHE_KEY = 'refund';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  /** 반품요청에 대한 환불처리
   * 1. 반품상품총합, 주문코드로 토스페이먼츠 결제취소 요청 dto, res -> 별도 함수로 작성
   * 2. 결과를 Refund, RefundItem으로 저장 dto, res
   */

  /** 환불내역 목록 조회 - 소비자, 판매자 */

  /** 특정 환불내역 상세 조회 */
}
