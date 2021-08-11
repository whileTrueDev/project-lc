import { Module } from '@nestjs/common';
import { AuthModule } from '../auth.module';
import { AuthService } from '../auth.service';
import { GoogleStrategy } from '../strategy/google.strategy';
import { NaverStrategy } from '../strategy/naver.strategy';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

@Module({
  imports: [AuthModule],
  controllers: [SocialController],
  providers: [SocialService, NaverStrategy, GoogleStrategy, AuthService],
  exports: [SocialService],
})
export class SocialModule {}
