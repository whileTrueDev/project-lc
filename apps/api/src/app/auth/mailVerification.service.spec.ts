/* eslint-disable dot-notation */
import { MailerModule } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from '@project-lc/prisma-orm';
import { mailerConfig } from '../../settings/mailer.config';
import { MailVerificationService } from './mailVerification.service';

describe('MailVerificationService', () => {
  const testEmail = 'test@testtest.com';
  let service: MailVerificationService;
  let __prisma: PrismaClient;
  let code: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, MailerModule.forRoot(mailerConfig)],
      providers: [MailVerificationService],
    }).compile();

    service = module.get<MailVerificationService>(MailVerificationService);
    __prisma = new PrismaClient();
  });

  afterAll(() => {
    __prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('[Private method] createEmailCode', () => {
    it('should make Email Code', async () => {
      code = await service['createEmailCode'](testEmail);
      expect(code).toBeDefined();
      expect(code.length).toBe(6);
    });
  });

  describe('checkMailVerification', () => {
    it('should be true if valid code is provided', async () => {
      const check = await service.checkMailVerification(testEmail, code);
      expect(!!check).toBe(true);
    });

    it('should be false if invalid code is provided', async () => {
      const check = await service.checkMailVerification(testEmail, 'invaildcode');
      expect(!!check).toBe(false);
    });
  });

  describe('deleteSuccessedMailVerification', () => {
    it('should work', async () => {
      const check = await service.deleteSuccessedMailVerification(testEmail);
      expect(check).toBeDefined();
    });
  });
});
