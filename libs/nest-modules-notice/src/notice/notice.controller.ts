import {
  Body,
  CacheTTL,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Notice, NoticeTarget } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { NoticePatchDto, NoticePostDto } from '@project-lc/shared-types';
import { NoticeService } from './notice.service';

@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('notice')
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  @CacheTTL(60 * 60 * 60) // 1시간
  getNotice(@Query('target') target: NoticeTarget): Promise<Notice[]> {
    return this.noticeService.getNotices(target);
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
