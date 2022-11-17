import { Controller, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MailVerificationDto, TargetUser } from '@project-lc/shared-types';

import { MailNoticeService } from './mail-notice.service';
import { MailService } from './mail.service';

@Controller()
export class MailController {
  constructor(
    private readonly mailNoticeService: MailNoticeService,
    private readonly mailService: MailService,
  ) {}

  /** 휴면계정 전환 예정 이메일 발송 */
  @MessagePattern('inactive-pre')
  sendPreInactiveMail(@Payload() user: TargetUser[]): Promise<boolean> {
    return this.mailNoticeService.sendPreInactivateMail(user);
  }

  /** 휴면계정 전환 이메일 발송 */
  @MessagePattern('inactive')
  sendInactiveMail(@Payload() user: TargetUser[]): Promise<boolean> {
    return this.mailNoticeService.sendInactivateMail(user);
  }

  /** 본인인증코드 메일 발송 */
  @MessagePattern('mail-verification')
  sendMailVerificationMail(
    @Payload(ValidationPipe) dto: MailVerificationDto,
  ): Promise<boolean> {
    return this.mailService.sendCodeVerificationMail(dto.targetEmail, dto.code);
  }
}
