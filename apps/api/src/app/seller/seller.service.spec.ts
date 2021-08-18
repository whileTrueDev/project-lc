/* eslint-disable dot-notation */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from '@project-lc/prisma-orm';
import { SellerService } from './seller.service';

describe('SellerService', () => {
  let service: SellerService;
  let __prisma: PrismaClient;
  const TEST_USER_EMAIL = 'exists_test@test.com';

  beforeAll(async () => {
    __prisma = new PrismaClient();
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [SellerService],
    }).compile();

    service = module.get<SellerService>(SellerService);
  });

  afterAll(async () => {
    await __prisma.seller.delete({ where: { email: TEST_USER_EMAIL } });
    await __prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('[PrivateMethod] hashPassword', () => {
    it('should return hashed password', async () => {
      const hashed = await service['hashPassword']('test');
      expect(hashed).toContain('$argon2');
    });
  });

  describe('[PrivateMethod] verifyPassword', () => {
    it('should return true if a valid password is provided', async () => {
      const hashed = await service['hashPassword']('test');
      expect(await service['verifyPassword']('test', hashed)).toBe(true);
    });

    it('should return false if a invalid password is provided', async () => {
      const hashed = await service['hashPassword']('test');
      expect(await service['verifyPassword']('invalidpassword', hashed)).toBe(false);
    });
  });

  describe('singUp', () => {
    it('should create seller', async () => {
      const newSeller = await service.signUp({
        email: TEST_USER_EMAIL,
        name: 'tester',
        password: 'testtest12!@',
      });

      expect(newSeller).toBeDefined();
      expect(newSeller.email).toBe(TEST_USER_EMAIL);
      expect(newSeller.name).toBe('tester');
    });
  });

  it('findOne', async () => {
    const seller = await service.findOne({ email: TEST_USER_EMAIL });
    expect(seller).toBeDefined();
    expect(seller.email).toBe(TEST_USER_EMAIL);
    expect(seller.name).toBe('tester');
  });

  describe('isEmailDupCheckOk', () => {
    it('should return true', async () => {
      expect(await service.isEmailDupCheckOk('test@test.com')).toBe(true);
    });

    it('should return false', async () => {
      expect(await service.isEmailDupCheckOk(TEST_USER_EMAIL)).toBe(false);
    });
  });
});
