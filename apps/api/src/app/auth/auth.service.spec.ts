import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { hash } from 'argon2';
import { AuthService } from './auth.service';
import { CipherService } from './cipher.service';
import { AuthController } from './auth.controller';
import { SellerModule } from '../seller/seller.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtConfigService } from '../../settings/jwt.setting';
import { SellerService } from '../seller/seller.service';

describe('AuthService', () => {
  let service: AuthService;
  let sellerService: SellerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // 원래는 app module에 의존성이나, 현재에도 필요.
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
    console.log('module init');
    service = module.get<AuthService>(AuthService);
    sellerService = module.get<SellerService>(SellerService);
  });

  it('user find', async () => {
    // 실제 DB와 함께 사용된다. -> spyOn을 통해서 바꿔보자.
    async function getResult() {
      const testPw = await hash('한글이름변수사용필요');
      return {
        id: 3,
        email: 'qkrcksdn0208@naver.com',
        name: 'wow',
        password: testPw,
      };
    }

    jest.spyOn(sellerService, 'findOne').mockImplementation(getResult);

    const user = await service.validateUser(
      'qkrcksdn0208@naver.com',
      '한글이름변수사용필요',
    );

    expect(user).toEqual({ sub: 'qkrcksdn0208@naver.com' });
  });

  it('user not find', async () => {
    const user = await service.validateUser('qkrcksdn0208@naver.com', '');
    expect(user).toEqual(null);
  });
});
