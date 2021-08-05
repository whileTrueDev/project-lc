import { Test } from '@nestjs/testing';
import { PrismaService } from '@project-lc/prisma-orm';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService, PrismaService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return "test"', async () => {
      const d = await service.getData();
      expect(d).toEqual({ message: 'test' });
    });
  });
});
