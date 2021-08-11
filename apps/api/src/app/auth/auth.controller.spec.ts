import { MailerModule } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@project-lc/prisma-orm';
import { AuthController } from './auth.controller';
import { mailerConfig } from '../../settings/mailer.config';
import { MailVerificationService } from './mailVerification.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MailerModule.forRoot(mailerConfig), PrismaModule],
      controllers: [AuthController],
      providers: [MailVerificationService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
