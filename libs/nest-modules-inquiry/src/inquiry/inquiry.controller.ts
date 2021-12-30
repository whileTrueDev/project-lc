import {
  Controller,
  Get,
  Post,
  ValidationPipe,
  Body,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { InquiryDto } from '@project-lc/shared-types';
import { Inquiry } from '@prisma/client';
import { JwtAuthGuard, AdminGuard } from '@project-lc/nest-modules-authguard';
import { InquiryService } from './inquiry.service';

@Controller('inquiry')
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
