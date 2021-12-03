import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';
import { GoogleStrategy } from './strategy/google.strategy';
import { NaverStrategy } from './strategy/naver.strategy';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { SellerModule } from '../seller/seller.module';
import { SellerService } from '../seller/seller.service';
import { SocialLoginExceptionFilter } from './social-login-exception.filter';
import { NaverApiService } from './platform-api/naver-api.service';
import { GoogleApiService } from './platform-api/google-api.service';
import { KakaoApiService } from './platform-api/kakao-api.service';
import { S3Module } from '../s3/s3.module';
import { SocialLoginUserTypeMiddleware } from '../_nest-units/middlewares/socialLoginUserType.middleware';

@Module({
  imports: [AuthModule, SellerModule, S3Module],
  controllers: [SocialController],
  providers: [
    NaverApiService,
    GoogleApiService,
    KakaoApiService,
    SocialService,
    NaverStrategy,
    GoogleStrategy,
    KakaoStrategy,
    SellerService,
    {
      provide: APP_FILTER,
      useClass: SocialLoginExceptionFilter,
    },
  ],
  exports: [SocialService],
})
export class SocialModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // 카카오, 구글, 네이버 소셜로그인 라우터에만 로그인하는 유저 타입 지정하는 미들웨어 사용
    consumer
      .apply(SocialLoginUserTypeMiddleware)
      .forRoutes(
        { path: 'social/naver/login', method: RequestMethod.GET },
        { path: 'social/google/login', method: RequestMethod.GET },
        { path: 'social/kakao/login', method: RequestMethod.GET },
      );
  }
}
