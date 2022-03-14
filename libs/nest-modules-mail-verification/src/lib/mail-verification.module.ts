import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MailVerificationService } from './mail-verification.service';

@Module({
  imports: [HttpModule],
  providers: [MailVerificationService],
  exports: [MailVerificationService],
})
export class MailVerificationModule {}
