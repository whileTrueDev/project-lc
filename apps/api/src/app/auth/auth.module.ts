import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailModule } from '../mail/mail.module';
import { MailVerificationService } from './mailVerification.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { SocialService } from './social/social.service';
import { NaverStrategy } from './strategy/naver.strategy';

@Module({
  imports: [MailModule],
  providers: [
    AuthService,
    MailVerificationService,
    GoogleStrategy,
    SocialService,
    NaverStrategy,
  ],
  controllers: [AuthController],
  exports: [MailVerificationService],
})
export class AuthModule {}
