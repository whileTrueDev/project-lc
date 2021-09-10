import { Test, TestingModule } from '@nestjs/testing';
import { FmExportsService } from './fm-exports.service';

describe('FmExportsService', () => {
  let service: FmExportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FmExportsService],
    }).compile();

    service = module.get<FmExportsService>(FmExportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
