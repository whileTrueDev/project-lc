import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@project-lc/prisma-orm';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthService } from './auth.service';
import { CipherService } from './cipher.service';
import { AuthController } from './auth.controller';
import { SellerModule } from '../seller/seller.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SellerService } from '../seller/seller.service';
import { authTestCases, findOne } from './auth.test-case';
import { MailVerificationService } from './mailVerification.service';
import { JwtConfigService } from '../_nest-units/settings/jwt.setting';
import { mailerConfig } from '../_nest-units/settings/mailer.config';
import { BroadcasterModule } from '../broadcaster/broadcaster.module';

describe('AuthService', () => {
  let service: AuthService;
  let sellerService: SellerService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        // 원래는 app module에 의존성이나, 현재에도 필요.
        ConfigModule.forRoot({ isGlobal: true }),
        SellerModule,
        BroadcasterModule,
        PassportModule,
        MailerModule.forRoot(mailerConfig),
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
    service = moduleRef.get<AuthService>(AuthService);
    sellerService = moduleRef.get<SellerService>(SellerService);
    jest.spyOn(sellerService, 'findOne').mockImplementation(findOne);
  });

  it('user find', async () => {
    const { param, result } = authTestCases[0];
    const user = await service.validateUser('seller', param.email, param.pwdInput);
    expect(user).toEqual(result);
  });

  const failCaseParam = authTestCases.slice(1);
  failCaseParam.forEach(({ param, result }, index) => {
    it(`user not find ${index}`, async () => {
      const user = await service.validateUser('seller', param.email, param.pwdInput);
      expect(user).toEqual(result);
    });
  });
});
