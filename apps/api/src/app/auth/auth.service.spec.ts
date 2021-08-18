import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@project-lc/prisma-orm';
import { mailerConfig } from '../../settings/mailer.config';
import { SellerModule } from '../seller/seller.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CipherService } from './cipher.service';
import { MailVerificationService } from './mailVerification.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MailerModule.forRoot(mailerConfig),
        PrismaModule,
        SellerModule,
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
          secret: 'test',
          signOptions: { expiresIn: '15m' },
        }),
      ],
      controllers: [AuthController],
      providers: [MailVerificationService, AuthService, CipherService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
