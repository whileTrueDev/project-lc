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
      expect(await service.validatePassword('test', hashed)).toBe(true);
    });

    it('should return false if a invalid password is provided', async () => {
      const hashed = await service['hashPassword']('test');
      expect(await service.validatePassword('invalidpassword', hashed)).toBe(false);
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
      expect(await service.isEmailDupCheckOk('test123123@test.com')).toBe(true);
    });

    it('should return false', async () => {
      expect(await service.isEmailDupCheckOk(TEST_USER_EMAIL)).toBe(false);
    });
  });

  describe('changePassword', () => {
    it('password should be different after has been changed', async () => {
      const passwordBefore = (await service.findOne({ email: TEST_USER_EMAIL })).password;
      await service.changePassword(TEST_USER_EMAIL, 'newPassword!');
      const passwordAfter = (await service.findOne({ email: TEST_USER_EMAIL })).password;
      expect(passwordAfter !== passwordBefore).toBe(true);
    });
  });

  describe('delete seller', () => {
    it('should delete exist seller', async () => {
      const TEST_DELETE_USER_EMAIL = 'test_email_to_be_deleted@gmail.com';
      const newSeller = await service.signUp({
        email: TEST_DELETE_USER_EMAIL,
        name: 'tester',
        password: 'testtest12!@',
      });
      expect(newSeller).toBeDefined();
      await service.deleteOne(TEST_DELETE_USER_EMAIL);
      expect(await service.findOne({ email: TEST_DELETE_USER_EMAIL })).toBeNull();
    });
  });
});
