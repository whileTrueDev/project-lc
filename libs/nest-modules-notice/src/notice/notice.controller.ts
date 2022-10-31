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

  /** target 에 맞는 공지사항 조회(postingFlag: true인 데이터만 조회함) */
  @Get()
  @CacheTTL(60 * 60 * 60) // 1시간
  getNotice(@Query('target') target: NoticeTarget): Promise<Notice[]> {
    return this.noticeService.getNotices(target);
  }

  /** 관리자페이지에서 전체 공지사항 조회(관리자용) */
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Get('/admin')
  getAdminNotice(): Promise<Notice[]> {
    return this.noticeService.getAdminNotices();
  }

  /** 공지사항 생성(관리자용) */
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Post()
  postNotice(@Body(ValidationPipe) dto: NoticePostDto): Promise<Notice> {
    return this.noticeService.postNotice(dto);
  }

  /** 공지사항 정보 수정(관리자용) */
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Patch()
  patchNotice(@Body(ValidationPipe) dto: NoticePatchDto): Promise<Notice> {
    return this.noticeService.patchNotice(dto);
  }

  /** 공지사항 삭제(관리자용) */
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Delete(':id')
  deleteNotice(@Param('id', ParseIntPipe) id: number): Promise<Notice> {
    return this.noticeService.deleteNotice(id);
  }
}
