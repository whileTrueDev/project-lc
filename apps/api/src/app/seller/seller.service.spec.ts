/* eslint-disable dot-notation */
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from '@project-lc/prisma-orm';
import { AuthService } from '../auth/auth.service';
import { CipherService } from '../auth/cipher.service';
import { SellerService } from './seller.service';

describe('SellerService', () => {
  let service: SellerService;
  let __prisma: PrismaClient;
  const TEST_USER_EMAIL = 'exists_test@test.com';
  let authService: AuthService;

  beforeAll(async () => {
    __prisma = new PrismaClient();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
          secret: 'test',
          signOptions: { expiresIn: '15m' },
        }),
      ],
      providers: [SellerService, AuthService, CipherService],
    }).compile();

    service = module.get<SellerService>(SellerService);
    authService = module.get<AuthService>(AuthService);
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

  describe('AuthService.validatePassword', () => {
    it('should return true if a valid password is provided', async () => {
      const hashed = await service['hashPassword']('test');
      expect(await authService['validatePassword']('test', hashed)).toBe(true);
    });

    it('should return false if a invalid password is provided', async () => {
      const hashed = await service['hashPassword']('test');
      expect(await authService['validatePassword']('test', hashed)).toBe(true);
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
