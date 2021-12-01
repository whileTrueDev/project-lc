import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@project-lc/prisma-orm';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { CipherService } from '../auth/cipher.service';
import { S3Service } from '../s3/s3.service';
import { SellerService } from '../seller/seller.service';
import { mailerConfig } from '../_nest-units/settings/mailer.config';
import { GoogleApiService } from './platform-api/google-api.service';
import { KakaoApiService } from './platform-api/kakao-api.service';
import { NaverApiService } from './platform-api/naver-api.service';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

describe('SocialController', () => {
  let controller: SocialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
          secret: 'test',
          signOptions: { expiresIn: '15m' },
        }),
        MailerModule.forRoot(mailerConfig),
      ],
      controllers: [SocialController],
      providers: [
        SocialService,
        AuthService,
        SellerService,
        CipherService,
        KakaoApiService,
        NaverApiService,
        GoogleApiService,
        S3Service,
      ],
    }).compile();

    controller = module.get<SocialController>(SocialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
