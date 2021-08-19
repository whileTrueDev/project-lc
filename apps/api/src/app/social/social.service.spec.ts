/* eslint-disable dot-notation */
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from '@project-lc/prisma-orm';
import { SellerService } from '../seller/seller.service';
import { SocialService } from './social.service';

describe('SocialService', () => {
  let service: SocialService;
  let __prisma: PrismaClient;

  const testInfo = {
    id: 'testServiceId',
    provider: 'testProvider',
    email: 'test@email.com',
    name: 'tester',
    picture: '',
    accessToken: 'fakeTokenFromProvider',
  };

  beforeAll(async () => {
    __prisma = new PrismaClient();
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [SocialService, SellerService],
    }).compile();

    service = module.get<SocialService>(SocialService);
  });

  afterAll(async () => {
    await __prisma.sellerSocialAccount.delete({ where: { serviceId: testInfo.id } });
    await __prisma.seller.delete({ where: { email: testInfo.email } });
    await __prisma.$disconnect();
  });

  describe('findOrCreateSeller', () => {
    it('should create new Seller has testInfo.email', async () => {
      const newSeller = await service.findOrCreateSeller(testInfo);

      expect(newSeller).toBeDefined();
      expect(newSeller.email).toBe(testInfo.email);
    });
  });

  describe('[PrivateMethod]findSocialAccountIncludeSeller', () => {
    it('should find socialAccount include Seller info', async () => {
      const { seller } = await service['findSocialAccountIncludeSeller']({
        provider: testInfo.provider,
        serviceId: testInfo.id,
      });

      expect(seller).toBeDefined();
    });
  });
});
