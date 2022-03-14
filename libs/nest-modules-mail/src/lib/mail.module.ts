import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { mailerConfig } from '@project-lc/nest-core';
import { MailNoticeService } from './mail-notice.service';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  providers: [MailNoticeService, MailService],
  controllers: [MailController],
})
export class MailModule {}
