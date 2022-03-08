import { Body, Controller, Post } from '@nestjs/common';
import { TargetUser } from '@project-lc/shared-types';
import { MailNoticeService } from './mail-notice.service';

@Controller()
export class MailController {
  constructor(private readonly mailNoticeService: MailNoticeService) {}

  @Post('/inactive-pre')
  sendPreInactiveMail(@Body() user: TargetUser[]): Promise<boolean> {
    return this.mailNoticeService.sendPreInactivateMail(user);
  }

  @Post('/inactive')
  sendInactiveMail(@Body() user: TargetUser[]): Promise<boolean> {
    return this.mailNoticeService.sendInactivateMail(user);
  }
}
