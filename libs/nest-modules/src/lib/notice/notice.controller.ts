import { Controller, Get } from '@nestjs/common';
import { Notice } from '@prisma/client';
import { NoticeService } from './notice.service';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  getNotice(): Promise<Notice[]> {
    return this.noticeService.getNotices();
  }
}
