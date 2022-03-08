import { Controller, Get, Post, Body } from '@nestjs/common';
import { TargetUser } from '@project-lc/shared-types';
import { MailNoticeService } from '../lib/mail/mail-notice.service';

@Controller()
export class AppController {
  constructor(private readonly mailNoticeService: MailNoticeService) {}
  @Get()
  healthCheck(): string {
    return 'alive';
  }

  @Post('/inactive-pre')
  sendPreInactiveMail(@Body() user: TargetUser[]): Promise<boolean> {
    return this.mailNoticeService.sendPreInactivateMail(user);
  }

  @Post('/inactive')
  sendInactiveMail(@Body() user: TargetUser[]): Promise<boolean> {
    return this.mailNoticeService.sendInactivateMail(user);
  }
}
