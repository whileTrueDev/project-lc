import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
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
import { findOne, authTestCases } from './auth.test-case';

describe('AuthController', () => {
  let app: INestApplication;
  let sellerService: SellerService;

  beforeAll(async () => {
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
    }).compile();

    sellerService = moduleRef.get<SellerService>(SellerService);
    jest.spyOn(sellerService, 'findOne').mockImplementation(findOne);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST login success`, () => {
    const successCaseParam = authTestCases[0].param;
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: successCaseParam.email, password: successCaseParam.pwdInput })
      .expect(200);
  });

  const failCaseParam = authTestCases.slice(1);
  failCaseParam.forEach(({ param }, index) => {
    it(`/POST login fail ${index}`, () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: param.email, password: param.pwdInput })
        .expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
