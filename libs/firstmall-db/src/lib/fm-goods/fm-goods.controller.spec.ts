import { Test, TestingModule } from '@nestjs/testing';
import { FmGoodsController } from './fm-goods.controller';

describe('FmGoodsController', () => {
  let controller: FmGoodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FmGoodsController],
    }).compile();

    controller = module.get<FmGoodsController>(FmGoodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
