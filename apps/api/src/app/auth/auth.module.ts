import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailVerificationService } from './mailVerification.service';

@Module({
  providers: [AuthService, MailVerificationService],
  controllers: [AuthController],
  exports: [MailVerificationService],
})
export class AuthModule {}
