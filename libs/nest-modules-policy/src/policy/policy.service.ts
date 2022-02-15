import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { Cache } from 'cache-manager';

@Injectable()
export class PolicyService extends ServiceBaseWithCache {
  #POLICY_CACHE_KEY = 'policy';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  // 생성
  async createPolicy(): Promise<any> {
    //   await this._clearCaches(this.#POLICY_CACHE_KEY);
    return 'create';
  }

  // 수정
  async updatePolicy(): Promise<any> {
    //   await this._clearCaches(this.#POLICY_CACHE_KEY);
    return 'update';
  }

  // 삭제
  async deletePolicy(): Promise<any> {
    //   await this._clearCaches(this.#POLICY_CACHE_KEY);
    return 'delete';
  }

  // 목록 조회
  async getPolicyList(): Promise<any> {
    return 'getPolicyList';
  }

  // 개별 조회
  async getOnePolicy(): Promise<any> {
    return 'getOnePolicy';
  }
}
