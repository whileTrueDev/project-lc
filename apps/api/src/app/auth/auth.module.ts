import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailModule } from '../mail/mail.module';
import { MailVerificationService } from './mailVerification.service';

@Module({
  imports: [MailModule],
  providers: [AuthService, MailVerificationService],
  controllers: [AuthController],
  exports: [MailVerificationService],
})
export class AuthModule {}
