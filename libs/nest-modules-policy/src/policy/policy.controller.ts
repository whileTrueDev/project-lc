import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { Policy } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { GetPolicyDto } from '@project-lc/shared-types';
import { PolicyService } from './policy.service';

@Controller('policy')
@UseInterceptors(HttpCacheInterceptor)
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  // * 목록조회
  @Get('list')
  async getPolicyList(@Query() dto: GetPolicyDto): Promise<Omit<Policy, 'content'>[]> {
    return this.policyService.getPolicyListByCategoryAndTarget(dto, { isAdmin: false });
  }

  // * 최신 데이터 1개 조회
  @Get()
  async getPolicy(@Query() dto: GetPolicyDto): Promise<Policy> {
    return this.policyService.getLatestPolicy(dto);
  }
}
