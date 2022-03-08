import { Body, Controller, Post } from '@nestjs/common';
import { TargetUser } from '@project-lc/shared-types';
import { MailVerificationDto } from './mail-dto/mail-verifications.dto';
import { MailNoticeService } from './mail-notice.service';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(
    private readonly mailNoticeService: MailNoticeService,
    private readonly mailService: MailService,
  ) {}

  @Post('/inactive-pre')
  sendPreInactiveMail(@Body() user: TargetUser[]): Promise<boolean> {
    return this.mailNoticeService.sendPreInactivateMail(user);
  }

  @Post('/inactive')
  sendInactiveMail(@Body() user: TargetUser[]): Promise<boolean> {
    return this.mailNoticeService.sendInactivateMail(user);
  }

  @Post('mail-verification')
  sendMailVerificationMail(@Body() dto: MailVerificationDto): Promise<boolean> {
    return this.mailService.sendCodeVerificationMail(dto.targetEmail, dto.code);
  }
}
