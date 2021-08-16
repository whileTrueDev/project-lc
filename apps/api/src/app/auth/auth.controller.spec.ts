import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { hash } from 'argon2';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthService } from './auth.service';
import { CipherService } from './cipher.service';
import { AuthController } from './auth.controller';
import { SellerModule } from '../seller/seller.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtConfigService } from '../../settings/jwt.setting';
import { SellerService } from '../seller/seller.service';

describe('AuthController', () => {
  let app: INestApplication;
  const sellerService = {
    findOne: async () => {
      const testPw = await hash('rkdghktn12');
      return {
        id: 3,
        email: 'qkrcksdn0208@naver.com',
        name: 'wow',
        password: testPw,
      };
    },
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        SellerModule,
        PassportModule,
        JwtModule.registerAsync({
          useClass: JwtConfigService,
        }),
      ],
      providers: [AuthService, CipherService, JwtStrategy, LocalStrategy],
      controllers: [AuthController],
    })
      .overrideProvider(SellerService)
      .useValue(sellerService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  // e2e test
  it(`/POST login success`, () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'qkrcksdn0208@naver.com', password: 'rkdghktn12' })
      .expect(200);
    // .expect({
    //   data: catsService.findAll(),
    // });
  });

  it(`/POST login fail`, () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'qkrcksdn0208@naver.com', password: 'qkrcksdn020' })
      .expect(401);
    // .expect({
    //   data: catsService.findAll(),
    // });
  });

  afterAll(async () => {
    await app.close();
  });
});
