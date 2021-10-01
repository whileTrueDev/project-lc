import { Test, TestingModule } from '@nestjs/testing';
import { GoodsInfoService } from './goods-info.service';

describe('GoodsInfoService', () => {
  let service: GoodsInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodsInfoService],
    }).compile();

    service = module.get<GoodsInfoService>(GoodsInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
