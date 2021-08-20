import { Test, TestingModule } from '@nestjs/testing';
import { FmOrdersController } from './fm-orders.controller';

describe('FmOrdersController', () => {
  let controller: FmOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FmOrdersController],
    }).compile();

    controller = module.get<FmOrdersController>(FmOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
