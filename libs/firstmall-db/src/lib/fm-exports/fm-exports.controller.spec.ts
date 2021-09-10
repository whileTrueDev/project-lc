import { Test, TestingModule } from '@nestjs/testing';
import { FmExportsController } from './fm-exports.controller';

describe('FmExportsController', () => {
  let controller: FmExportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FmExportsController],
    }).compile();

    controller = module.get<FmExportsController>(FmExportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
