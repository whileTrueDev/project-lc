import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GoogleStrategy } from './strategy/google.strategy';
import { NaverStrategy } from './strategy/naver.strategy';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { SellerModule } from '../seller/seller.module';
import { SellerService } from '../seller/seller.service';

@Module({
  imports: [AuthModule, SellerModule],
  controllers: [SocialController],
  providers: [SocialService, NaverStrategy, GoogleStrategy, KakaoStrategy, SellerService],
  exports: [SocialService],
})
export class SocialModule {}
