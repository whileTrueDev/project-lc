import { Controller, Post, ValidationPipe, Body, UseGuards } from '@nestjs/common';
import { Notice } from '@prisma/client';
import { NoticePostDto } from '@project-lc/shared-types';
import { InquiryService } from './inquiry.service';
import { AdminGuard } from '../_nest-units/guards/admin.guard';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
@Controller('notice')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(AdminGuard)
  // @Get('/admin')
  // getAdminNotice(): Promise<Notice[]> {
  //   // return this.noticeService.getAdminNotices();
  // }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Post()
  postNotice(@Body(ValidationPipe) dto: InquiryService): Promise<boolean> {}
}
