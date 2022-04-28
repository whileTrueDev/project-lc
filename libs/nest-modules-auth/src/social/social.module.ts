import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SocialLoginUserTypeMiddleware } from '@project-lc/nest-core';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { CustomerModule } from '@project-lc/nest-modules-customer';
import { SellerModule } from '@project-lc/nest-modules-seller';
import { AuthModule } from '../auth/auth.module';
import { GoogleApiService } from './platform-api/google-api.service';
import { KakaoApiService } from './platform-api/kakao-api.service';
import { NaverApiService } from './platform-api/naver-api.service';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { NaverStrategy } from './strategy/naver.strategy';

@Module({
  imports: [
    AuthModule,
    BroadcasterModule.withoutControllers(),
    SellerModule.withoutControllers(),
    CustomerModule.withoutControllers(),
  ],
  controllers: [SocialController],
  providers: [
    NaverApiService,
    GoogleApiService,
    KakaoApiService,
    SocialService,
    NaverStrategy,
    GoogleStrategy,
    KakaoStrategy,
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
