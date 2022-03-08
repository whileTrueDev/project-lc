import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { mailerConfig } from '@project-lc/nest-core';
import { MailVerificationService } from './mailVerification.service';
import { MailNoticeService } from './mail-notice.service';
import { MailController } from './mail.controller';

@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  providers: [MailVerificationService, MailNoticeService],
  exports: [MailVerificationService, MailNoticeService],
  controllers: [MailController],
})
export class MailModule {}
