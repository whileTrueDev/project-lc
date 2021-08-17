import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@project-lc/prisma-orm';
import { AuthService } from '../auth/auth.service';
import { SellerService } from '../seller/seller.service';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

describe('SocialController', () => {
  let controller: SocialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, ConfigModule],
      controllers: [SocialController],
      providers: [SocialService, AuthService, SellerService],
      exports: [SocialService],
    }).compile();

    controller = module.get<SocialController>(SocialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
