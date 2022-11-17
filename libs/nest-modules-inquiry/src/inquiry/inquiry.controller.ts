import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Inquiry } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { InquiryDto } from '@project-lc/shared-types';
import { InquiryService } from './inquiry.service';

@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('inquiry')
@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  /** 일반문의 전체 조회(관리자가 사용) */
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Get()
  getAdminNotice(): Promise<Inquiry[]> {
    return this.inquiryService.getInquries();
  }

  /** 일반문의 생성 */
  @Post()
  registInquiry(@Body(ValidationPipe) dto: InquiryDto): Promise<boolean> {
    return this.inquiryService.registInquiry(dto);
  }

  /** 일반문의 읽음여부 수정(관리자가 사용) */
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Patch()
  updateInquiryReadFlag(
    @Body(ValidationPipe) inquiryId: { inquiryId: number },
  ): Promise<boolean> {
    return this.inquiryService.updateReadFlag(inquiryId);
  }
}
