import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../../../../../prisma-orm/src';
import { LoginHistoryService } from './login-history.service';

describe('LoginHistoryService', () => {
  let service: LoginHistoryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [LoginHistoryService],
    }).compile();

    service = module.get<LoginHistoryService>(LoginHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
