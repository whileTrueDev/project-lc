import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { mailerConfig } from '../settings/mailer.config';
import { MailNoticeService } from './mail-notice.service';

@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  providers: [MailNoticeService],
  exports: [MailNoticeService],
})
export class MailModule {}
