import { MailerModule } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@project-lc/prisma-orm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { mailerConfig } from '../../settings/mailer.config';
import { MailVerificationService } from './mailVerification.service';
import { AuthService } from './auth.service';
import { SellerModule } from '../seller/seller.module';
import { CipherService } from './cipher.service';

describe('AuthController', () => {
  let controller: AuthController;

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

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
