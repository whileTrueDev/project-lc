import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@project-lc/prisma-orm';
import { SellerService } from '../seller/seller.service';
import { SocialService } from './social.service';

describe('SocialService', () => {
  let service: SocialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [SocialService, ConfigService, SellerService],
    }).compile();

    service = module.get<SocialService>(SocialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
