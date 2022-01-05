import { Module } from '@nestjs/common';
import { MailVerificationService } from './mailVerification.service';

@Module({
  providers: [MailVerificationService],
  exports: [MailVerificationService],
})
export class MailModule {}
