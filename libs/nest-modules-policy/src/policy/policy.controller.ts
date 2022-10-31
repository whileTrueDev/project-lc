import { Controller, Get, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { Policy } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { GetPolicyDto } from '@project-lc/shared-types';
import { PolicyService } from './policy.service';

@Controller('policy')
@UseInterceptors(HttpCacheInterceptor)
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  /**
   * 이용약관/개인정보처리방침 목록조회
   * @param dto.targetUser 방송인, 판매자, 소비자 구분
   * @param dto.category 이용약관,개인정보처리방침 구분
   * @returns 실제내용(content)는 제외한 이용약관/개인정보처리방침 목록
   */
  @Get('list')
  async getPolicyList(@Query() dto: GetPolicyDto): Promise<Omit<Policy, 'content'>[]> {
    return this.policyService.getPolicyListByCategoryAndTarget(dto, { isAdmin: false });
  }

  /**
   * 이용약관/개인정보처리방침 최신 데이터 조회
   * @param dto.targetUser 방송인, 판매자, 소비자 구분
   * @param dto.category 이용약관,개인정보처리방침 구분
   * @returns 최신 버전의 이용약관/개인정보처리방침
   */
  @Get()
  async getPolicy(
    @Query(new ValidationPipe({ transform: true })) dto: GetPolicyDto,
  ): Promise<Policy> {
    return this.policyService.getLatestPolicy(dto);
  }
}
