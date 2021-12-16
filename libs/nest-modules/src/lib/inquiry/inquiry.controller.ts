import { Controller, Post, ValidationPipe, Body, UseGuards } from '@nestjs/common';
import { InquiryDTO } from '@project-lc/shared-types';
import { InquiryService } from './inquiry.service';
import { AdminGuard } from '../_nest-units/guards/admin.guard';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';

@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(AdminGuard)
  // @Get('/admin')
  // getAdminNotice(): Promise<Notice[]> {
  //   // return this.noticeService.getAdminNotices();
  // }

  @Post()
  registInquiry(@Body(ValidationPipe) dto: InquiryDTO): Promise<boolean> {
    return this.inquiryService.registInquiry(dto);
  }
}
