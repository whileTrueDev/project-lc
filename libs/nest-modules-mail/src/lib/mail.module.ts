import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { mailerConfig } from '@project-lc/nest-core';
import { MailVerificationService } from '..';

@Module({
  imports: [MailerModule.forRoot(mailerConfig)],
  providers: [MailVerificationService],
  exports: [MailVerificationService],
})
export class MailModule {}
