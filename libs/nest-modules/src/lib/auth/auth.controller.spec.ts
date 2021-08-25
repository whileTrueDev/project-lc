import { MailerModule } from '@nestjs-modules/mailer';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@project-lc/prisma-orm';
import request from 'supertest';
import { SellerModule } from '../seller/seller.module';
import { SellerService } from '../seller/seller.service';
import { JwtConfigService } from '../_nest-units/settings/jwt.setting';
import { mailerConfig } from '../_nest-units/settings/mailer.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { authTestCases, findOne } from './auth.test-case';
import { CipherService } from './cipher.service';
import { MailVerificationService } from './mailVerification.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

describe('AuthController', () => {
  let app: INestApplication;
  let sellerService: SellerService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        SellerModule,
        ConfigModule.forRoot({ isGlobal: true }),
        MailerModule.forRoot(mailerConfig),
        PassportModule,
        JwtModule.registerAsync({
          useClass: JwtConfigService,
        }),
        PrismaModule,
      ],
      providers: [
        AuthService,
        CipherService,
        JwtStrategy,
        LocalStrategy,
        MailVerificationService,
      ],
      controllers: [AuthController],
    }).compile();

    sellerService = moduleRef.get<SellerService>(SellerService);
    jest.spyOn(sellerService, 'findOne').mockImplementation(findOne);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('POST /login', () => {
    it(`should success`, () => {
      const successCaseParam = authTestCases[0].param;
      return request(app.getHttpServer())
        .post('/auth/login?type=seller')
        .send({ email: successCaseParam.email, password: successCaseParam.pwdInput })
        .expect(200);
    });

    it('should be failed with 403 error code when the type query was not provided', () => {
      const successCaseParam = authTestCases[0].param;
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: successCaseParam.email, password: successCaseParam.pwdInput })
        .expect(403);
    });

    const failCaseParam = authTestCases.slice(1);
    failCaseParam.forEach(({ param }, index) => {
      it(`should be failed with 401 error code - test case: ${index}`, () => {
        return request(app.getHttpServer())
          .post('/auth/login?type=seller')
          .send({ email: param.email, password: param.pwdInput })
          .expect(401);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
