import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@project-lc/prisma-orm';
import { S3Module } from '../s3/s3.module';
import { GoodsInfoService } from './goods-info.service';

describe('GoodsInfoService', () => {
  let service: GoodsInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, S3Module, ConfigModule.forRoot({ isGlobal: true })],
      providers: [GoodsInfoService],
    }).compile();

    service = module.get<GoodsInfoService>(GoodsInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
