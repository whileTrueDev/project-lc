import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { PolicyService } from './policy.service';

@Controller('policy')
@UseInterceptors(HttpCacheInterceptor)
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  // * 개별조회 : 판매자센터, 방송인센터에서 사용
  // @UseGuards(JwtAuthGuard)
  @Get()
  getPolicy(): Promise<any> {
    return this.policyService.getOnePolicy();
  }
}
