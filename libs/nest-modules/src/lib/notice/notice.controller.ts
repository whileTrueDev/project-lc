import {
  Controller,
  Get,
  Post,
  ValidationPipe,
  Body,
  Patch,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Notice } from '@prisma/client';
import { NoticePostDto, NoticePatchDto } from '@project-lc/shared-types';
import { NoticeService } from './notice.service';
import { AdminGuard } from '../_nest-units/guards/admin.guard';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  getNotice(): Promise<Notice[]> {
    return this.noticeService.getNotices();
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Get('/admin')
  getAdminNotice(): Promise<Notice[]> {
    return this.noticeService.getAdminNotices();
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Post()
  postNotice(@Body(ValidationPipe) dto: NoticePostDto): Promise<Notice> {
    return this.noticeService.postNotice(dto);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Patch()
  patchNotice(@Body(ValidationPipe) dto: NoticePatchDto): Promise<Notice> {
    return this.noticeService.patchNotice(dto);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Delete(':id')
  deleteNotice(@Param('id', ParseIntPipe) id: number): Promise<Notice> {
    return this.noticeService.deleteNotice(id);
  }
}
