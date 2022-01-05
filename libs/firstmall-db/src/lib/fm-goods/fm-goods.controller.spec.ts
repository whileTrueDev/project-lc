import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GoodsService } from '@project-lc/nest-modules-goods';
import { S3Service } from '@project-lc/nest-modules-s3';
import { PrismaService } from '@project-lc/prisma-orm';
import { FirstmallDbService } from '../firstmall-db.service';
import { FmGoodsController } from './fm-goods.controller';
import { FMGoodsService } from './fm-goods.service';

describe('FmGoodsController', () => {
  let controller: FmGoodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        FMGoodsService,
        FirstmallDbService,
        GoodsService,
        PrismaService,
        S3Service,
      ],
      controllers: [FmGoodsController],
    }).compile();

    controller = module.get<FmGoodsController>(FmGoodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
