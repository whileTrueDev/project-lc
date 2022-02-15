import { Controller, Get, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
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
    return this.policyService.getPolicyList(dto, { isAdmin: false });
  }

  // * 개별조회
  @Get()
  async getPolicy(@Query('id', ParseIntPipe) id: number): Promise<Policy | false> {
    return this.policyService.getOnePolicy(id, { isAdmin: false });
  }
}
