import { MailerModule } from '@nestjs-modules/mailer';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@project-lc/prisma-orm';
import request from 'supertest';
import { Context, createMockContext, MockContext } from '../../test-utils/context';
import { SellerModule } from '../seller/seller.module';
import { SellerService } from '../seller/seller.service';
import { JwtConfigService } from '../_nest-units/settings/jwt.setting';
import { mailerConfig } from '../_nest-units/settings/mailer.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { findOne } from './auth.test-case';
import { CipherService } from './cipher.service';
import { LoginHistoryService } from './login-history/login-history.service';
import { MailVerificationService } from './mailVerification.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

describe('AuthController', () => {
  let app: INestApplication;
  let controller: AuthController;
  let sellerService: SellerService;
  let loginHistory: LoginHistoryService;

  let mockCtx: MockContext;
  let ctx: Context;

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
        LoginHistoryService,
      ],
      controllers: [AuthController],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
    sellerService = moduleRef.get<SellerService>(SellerService);
    jest.spyOn(sellerService, 'findOne').mockImplementation(findOne);
    loginHistory = moduleRef.get<LoginHistoryService>(LoginHistoryService);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  beforeEach(() => {
    mockCtx = createMockContext();
    ctx = mockCtx as unknown as Context; // Needed until https://github.com/marchaos/jest-mock-extended/issues/25
  });

  // describe('POST /login', () => {
  //   (prismaMock.loginHistory as any).create.mockResolvedValue(loginHistorySample);

  //   it(`should success`, () => {
  //     const successCaseParam = authTestCases[0].param;
  //     return request(app.getHttpServer())
  //       .post('/auth/login?type=seller')
  //       .send({ email: successCaseParam.email, password: successCaseParam.pwdInput })
  //       .expect(200);
  //   });

  //   it('should be failed with 403 error code when the type query was not provided', () => {
  //     const successCaseParam = authTestCases[0].param;
  //     return request(app.getHttpServer())
  //       .post('/auth/login')
  //       .send({ email: successCaseParam.email, password: successCaseParam.pwdInput })
  //       .expect(403);
  //   });

  //   const failCaseParam = authTestCases.slice(1);
  //   failCaseParam.forEach(({ param }, index) => {
  //     it(`should be failed with 401 error code - test case: ${index}`, () => {
  //       return request(app.getHttpServer())
  //         .post('/auth/login?type=seller')
  //         .send({ email: param.email, password: param.pwdInput })
  //         .expect(401);
  //     });
  //   });
  // });
  describe('POST /code-verification', () => {
    it('should throw 400 error with code has longer than 6 characters', () => {
      return request(app.getHttpServer())
        .post('/auth/code-verification')
        .send({ email: 'test@gmail.com', code: 'wrongCodeLongerThan6Char' })
        .expect(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
