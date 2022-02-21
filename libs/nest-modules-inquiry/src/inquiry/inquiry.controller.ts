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
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { InquiryDto } from '@project-lc/shared-types';
import { InquiryService } from './inquiry.service';

@Controller('inquiry')
@UseInterceptors(HttpCacheInterceptor)
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Get()
  getAdminNotice(): Promise<Inquiry[]> {
    return this.inquiryService.getInquries();
  }

  @Post()
  registInquiry(@Body(ValidationPipe) dto: InquiryDto): Promise<boolean> {
    return this.inquiryService.registInquiry(dto);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Patch()
  updateInquiryReadFlag(
    @Body(ValidationPipe) inquiryId: { inquiryId: number },
  ): Promise<boolean> {
    return this.inquiryService.updateReadFlag(inquiryId);
  }
}
