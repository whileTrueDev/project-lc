import { BadRequestException, Injectable } from '@nestjs/common';
import { Policy, Prisma } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreatePolicyDto,
  GetPolicyDto,
  POLICY_CATEGORY,
  POLICY_TARGET_USER,
  UpdatePolicyDto,
} from '@project-lc/shared-types';

type PolicyFindOption = {
  isAdmin: boolean;
};
@Injectable()
export class PolicyService {
  constructor(private readonly prisma: PrismaService) {}

  /** 기존 약관/방침 개수 세기 */
  private async countPolicy(where: Prisma.PolicyWhereInput): Promise<number> {
    const policyCount = await this.prisma.policy.count({ where });
    return policyCount;
  }

  /** 다음 버전의 약관/방침 명칭 생성
   * `{대상}_{이용약관/개인정보처리방침}_{버전}차` 형태
   */
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

  /** 이용약관/개인정보처리방침 생성  */
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
    return data;
  }

  /** 고유번호로 이용약관/개인정보처리방침 조회 */
  private async findPolicyById(id: number): Promise<Policy> {
    const policy = await this.prisma.policy.findUnique({ where: { id } });
    if (!policy) {
      throw new BadRequestException(
        `해당 고유번호를 가진 Policy 데이터가 존재하지 않습니다 id: ${id}`,
      );
    }
    return policy;
  }

  /** 공개약관 최소 1개는 있도록 강제하기 위해 공개 약관 개수 확인하는 함수
   * - 카테고리, 대상별 약관 목록 중 공개여부: true 인 데이터가 1개 이하인 경우 에러 */
  private async throwErrorIfPublicPolicyWillNotExist({
    category,
    targetUser,
  }: GetPolicyDto): Promise<void> {
    const count = await this.countPolicy({ category, targetUser, publicFlag: true });
    if (count <= 1) {
      throw new BadRequestException(
        `${POLICY_TARGET_USER[targetUser]} ${POLICY_CATEGORY[category]} 중 적어도 1개의 공개약관이 존재해야 합니다.`,
      );
    }
  }

  /** 이용약관/개인정보처리방침 수정 */
  public async updatePolicy(policyId: number, dto: UpdatePolicyDto): Promise<Policy> {
    const policy = await this.findPolicyById(policyId);

    // 수정요청 데이터에 공개여부:false 포함된 경우에만 확인
    if ('publicFlag' in dto && dto.publicFlag === false) {
      await this.throwErrorIfPublicPolicyWillNotExist(policy);
    }

    const data = await this.prisma.policy.update({
      where: { id: policy.id },
      data: { ...dto },
    });
    return data;
  }

  /** 이용약관/개인정보처리방침 삭제 */
  public async deletePolicy(policyId: number): Promise<boolean> {
    const policy = await this.findPolicyById(policyId);

    const { category, targetUser } = policy;
    // 기존 공개약관 개수
    const existPublicPolicyCount = await this.countPolicy({
      category,
      targetUser,
      publicFlag: true,
    });
    // 삭제 후 남아있을 공개약관 개수 <= 0 인경우 에러발생
    if (existPublicPolicyCount - Number(policy.publicFlag) <= 0) {
      throw new BadRequestException(
        `${POLICY_TARGET_USER[targetUser]} ${POLICY_CATEGORY[category]} 중 적어도 1개의 공개약관이 존재해야 합니다.`,
      );
    }

    // 삭제해도 공개약관 남아 있을 경우에만 삭제 실행
    await this.prisma.policy.delete({
      where: { id: policy.id },
    });

    return true;
  }

  /** 정책,약관 목록조회(컨텐츠는 포함하지 않음) */
  private async getPolicyListWithoutContent(
    where?: Prisma.PolicyWhereInput,
  ): Promise<Omit<Policy, 'content'>[]> {
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
   * 특정 카테고리 & 타겟 정책 목록 조회 => 카테고리와 타겟유저에 해당하는 목록만 조회(컨텐츠 제외)
   * @param dto { category: PolicyCategory, targetUser: PolicyTarget} 카테고리와 타겟유저 명시 필요
   * @param options? {isAdmin: boolean} 관리자 요청인경우 {isAdmin:true}로 전달한다 => 공개여부 false인 데이터도 조회 가능
   * @return content를 제외한 Policy 목록
   */
  public async getPolicyListByCategoryAndTarget(
    dto: GetPolicyDto,
    options?: PolicyFindOption,
  ): Promise<Omit<Policy, 'content'>[]> {
    let where: Prisma.PolicyWhereInput = dto;
    // 관리자가 아닌경우 공개여부 true인 데이터만 조회
    if (!options?.isAdmin) {
      where = { ...where, publicFlag: true };
    }
    return this.getPolicyListWithoutContent(where);
  }

  /** 관리자용 목록 조회(카테고리, 타겟 무관하게 전체조회) */
  public async getAdminPolicyList(): Promise<Omit<Policy, 'content'>[]> {
    return this.getPolicyListWithoutContent();
  }

  /**
   * 특정 정책 조회
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

  /** 최신정책 1개 조회 */
  public async getLatestPolicy(dto: GetPolicyDto): Promise<Policy | null> {
    const data = await this.prisma.policy.findMany({
      where: {
        category: dto.category,
        targetUser: dto.targetUser,
        publicFlag: true,
      },
      orderBy: [{ enforcementDate: 'desc' }, { createDate: 'desc' }],
      take: 1,
    });

    if (!data.length) return null;

    return data[0];
  }
}
