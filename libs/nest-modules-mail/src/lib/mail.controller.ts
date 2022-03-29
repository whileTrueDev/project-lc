import { Controller, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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

  @MessagePattern('inactive-pre')
  sendPreInactiveMail(@Payload() user: TargetUser[]): Promise<boolean> {
    return this.mailNoticeService.sendPreInactivateMail(user);
  }

  @MessagePattern('inactive')
  sendInactiveMail(@Payload() user: TargetUser[]): Promise<boolean> {
    return this.mailNoticeService.sendInactivateMail(user);
  }

  @MessagePattern('mail-verification')
  sendMailVerificationMail(
    @Payload(ValidationPipe) dto: MailVerificationDto,
  ): Promise<boolean> {
    return this.mailService.sendCodeVerificationMail(dto.targetEmail, dto.code);
  }
}
