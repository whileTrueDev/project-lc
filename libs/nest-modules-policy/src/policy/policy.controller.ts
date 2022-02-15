import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { Policy } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { GetPolicyListDto } from '@project-lc/shared-types';
import { PolicyService } from './policy.service';

// @UseGuards(JwtAuthGuard)
@Controller('policy')
@UseInterceptors(HttpCacheInterceptor)
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  // * 목록조회
  @Get('list')
  async getPolicyList(
    @Query() dto: GetPolicyListDto,
  ): Promise<Omit<Policy, 'content'>[]> {
    // 방송인, 판매자센터에서 조회하는 정책목록은 공개여부값이 true인 데이터만 조회한다
    return this.policyService.getPolicyList(dto, true);
  }

  // * 개별조회
  @Get()
  async getPolicy(): Promise<any> {
    return this.policyService.getOnePolicy();
  }
}
