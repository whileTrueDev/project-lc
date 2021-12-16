import { Controller, Get, Post, ValidationPipe, Body, UseGuards } from '@nestjs/common';
import { InquiryDto } from '@project-lc/shared-types';
import { Inquiry } from '@prisma/client';
import { InquiryService } from './inquiry.service';
import { AdminGuard } from '../_nest-units/guards/admin.guard';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';

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
}
