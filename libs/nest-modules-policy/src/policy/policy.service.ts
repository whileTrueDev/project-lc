import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { Cache } from 'cache-manager';
import { Policy, PolicyCategory, PolicyTarget, Prisma } from '@prisma/client';
import { CreatePolicyDto, GetPolicyListDto } from '@project-lc/shared-types';

const POLICY_TARGET_USER: Record<PolicyTarget, string> = {
  seller: '판매자',
  broadcaster: '방송인',
  all: '전체',
};
const POLICY_CATEGORY: Record<PolicyCategory, string> = {
  termsOfService: '이용약관',
  privacy: '개인정보처리방침',
};

type PolicyFindOption = {
  isAdmin: boolean;
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
    const { category, targetUser, version } = dto;
    const nextVersion =
      version || (await this.createNextVersionName({ category, targetUser }));
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

  /**
   * 목록 조회
   * @param dto { category: PolicyCategory, targetUser: PolicyTarget} 카테고리와 타겟유저 명시 필요
   * @param options? {isAdmin: boolean} 관리자 요청인경우 {isAdmin:true}로 전달한다 => 공개여부 false인 데이터도 조회 가능
   * @return content를 제외한 Policy 목록
   */
  public async getPolicyList(
    dto: GetPolicyListDto,
    options?: PolicyFindOption,
  ): Promise<Omit<Policy, 'content'>[]> {
    let where: Prisma.PolicyWhereInput = dto;
    // 관리자가 아닌경우 공개여부 true인 데이터만 조회
    if (!options?.isAdmin) {
      where = { ...where, publicFlag: true };
    }
    return this.prisma.policy.findMany({
      where,
      orderBy: [{ enforcementDate: 'desc' }, { createDate: 'desc' }],
      select: {
        id: true,
        category: true,
        targetUser: true,
        createDate: true,
        updateDate: true,
        enforcementDate: true,
        version: true,
        publicFlag: true,
      },
    });
  }

  /**
   * 개별 조회
   * @param policyId
   * @param options? {isAdmin: boolean} 관리자 요청인경우 {isAdmin:true}로 전달한다 => 공개여부 false인 데이터도 조회 가능
   * @returns 해당id를 가진 policy 존재하는 경우 Policy 반환
   * 해당 policy가 존재하지 않거나 관리자 옵션 없이 공개되지 않은 policy 요청한경우 false반환
   */
  public async getOnePolicy(
    policyId: number,
    options?: PolicyFindOption,
  ): Promise<Policy | false> {
    let where: Prisma.PolicyWhereInput = { id: policyId };
    // 관리자가 아닌경우 공개여부 true인 데이터만 조회
    if (!options?.isAdmin) {
      where = { ...where, publicFlag: true };
    }
    const data = await this.prisma.policy.findFirst({
      where,
    });
    if (!data) return false;
    return data;
  }
}
