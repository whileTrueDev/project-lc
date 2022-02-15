import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { Cache } from 'cache-manager';
import { Policy, PolicyCategory, PolicyTarget } from '@prisma/client';
import { CreatePolicyDto } from '@project-lc/shared-types';

const POLICY_TARGET_USER: Record<PolicyTarget, string> = {
  seller: '판매자',
  broadcaster: '방송인',
  all: '전체',
};
const POLICY_CATEGORY: Record<PolicyCategory, string> = {
  termsOfService: '이용약관',
  privacy: '개인정보처리방침',
};
@Injectable()
export class PolicyService extends ServiceBaseWithCache {
  #POLICY_CACHE_KEY = 'policy';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  private async countPolicy({
    category,
    targetUser,
  }: Pick<CreatePolicyDto, 'category' | 'targetUser'>): Promise<number> {
    const policyCount = await this.prisma.policy.count({
      where: {
        category,
        targetUser,
      },
    });
    return policyCount;
  }

  private async createNextVersionName({
    category,
    targetUser,
  }: Pick<CreatePolicyDto, 'category' | 'targetUser'>): Promise<string> {
    const count = await this.countPolicy({ category, targetUser });
    const categoryName = POLICY_CATEGORY[category];
    const targetUserName = POLICY_TARGET_USER[targetUser];
    // count + 1 해서 증가시킴
    return `${targetUserName}_${categoryName}_${count + 1}차`;
  }

  // 생성
  public async createPolicy(dto: CreatePolicyDto): Promise<Policy> {
    const { category, targetUser } = dto;
    const nextVersion = await this.createNextVersionName({ category, targetUser });
    const data = this.prisma.policy.create({
      data: {
        ...dto,
        version: nextVersion,
      },
    });
    await this._clearCaches(this.#POLICY_CACHE_KEY);
    return data;
  }

  // 수정
  public async updatePolicy(): Promise<any> {
    //   await this._clearCaches(this.#POLICY_CACHE_KEY);
    return 'update';
  }

  // 삭제
  public async deletePolicy(): Promise<any> {
    //   await this._clearCaches(this.#POLICY_CACHE_KEY);
    return 'delete';
  }

  // 목록 조회
  public async getPolicyList(): Promise<Policy[]> {
    return this.prisma.policy.findMany();
  }

  // 개별 조회
  public async getOnePolicy(): Promise<any> {
    return 'getOnePolicy';
  }
}
