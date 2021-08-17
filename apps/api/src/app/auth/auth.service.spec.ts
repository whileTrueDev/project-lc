import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { CipherService } from './cipher.service';
import { AuthController } from './auth.controller';
import { SellerModule } from '../seller/seller.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtConfigService } from '../../settings/jwt.setting';
import { SellerService } from '../seller/seller.service';
import { authTestCases, MockSellerService } from './auth.test-case';

describe('AuthService', () => {
  let service: AuthService;
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        // 원래는 app module에 의존성이나, 현재에도 필요.
        ConfigModule.forRoot({ isGlobal: true }),
        SellerModule,
        PassportModule,
        JwtModule.registerAsync({
          useClass: JwtConfigService,
        }),
      ],
      providers: [
        {
          provide: SellerService,
          useClass: MockSellerService,
        },
        AuthService,
        CipherService,
        JwtStrategy,
        LocalStrategy,
      ],
      controllers: [AuthController],
    }).compile();
    service = moduleRef.get<AuthService>(AuthService);

    console.log('module init');
  });

  it('user find', async () => {
    const { param, result } = authTestCases[0];
    const user = await service.validateUser(param.email, param.pwdInput);
    expect(user).toEqual(result);
  });

  const failCaseParam = authTestCases.slice(1);
  failCaseParam.forEach(({ param, result }, index) => {
    it(`user not find ${index}`, async () => {
      const user = await service.validateUser(param.email, param.pwdInput);
      expect(user).toEqual(result);
    });
  });
});
