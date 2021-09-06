import { Test, TestingModule } from '@nestjs/testing';
import { GoodsService } from '@project-lc/nest-modules';
import { PrismaService } from '@project-lc/prisma-orm';
import { FirstmallDbService } from '../firstmall-db.service';
import { FmGoodsController } from './fm-goods.controller';
import { FMGoodsService } from './fm-goods.service';

describe('FmGoodsController', () => {
  let controller: FmGoodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FMGoodsService, FirstmallDbService, GoodsService, PrismaService],
      controllers: [FmGoodsController],
    }).compile();

    controller = module.get<FmGoodsController>(FmGoodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
