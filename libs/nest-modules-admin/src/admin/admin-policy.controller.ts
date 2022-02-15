import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Policy } from '@prisma/client';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { PolicyService } from '@project-lc/nest-modules-policy';
import { CreatePolicyDto, UpdatePolicyDto } from '@project-lc/shared-types';

/** ================================= */
// 정책(개인정보처리방침, 이용약관) Policy
/** ================================= */
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/policy')
export class AdminPolicyController {
  constructor(private readonly policyService: PolicyService) {}

  /** 정책(개인정보처리방침, 이용약관) 목록 조회 */
  @Get('list')
  async getPolicyList(): Promise<Omit<Policy, 'content'>[]> {
    return this.policyService.getAdminPolicyList();
  }

  // * 개별조회
  @Get()
  async getPolicy(@Query('id', ParseIntPipe) id: number): Promise<Policy | false> {
    return this.policyService.getOnePolicy(id, { isAdmin: true });
  }

  /** 정책(개인정보처리방침, 이용약관) 생성 */

  @Post()
  async createPolicy(@Body(ValidationPipe) dto: CreatePolicyDto): Promise<Policy> {
    return this.policyService.createPolicy(dto);
  }

  /** 정책 수정 */
  @Patch(':id')
  async updatePolicy(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdatePolicyDto,
  ): Promise<Policy> {
    return this.policyService.updatePolicy(id, dto);
  }

  /** 정책 삭제 */
  @Delete(':id')
  async deletePolicy(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.policyService.deletePolicy(id);
  }
}
