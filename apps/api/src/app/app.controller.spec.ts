import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@project-lc/prisma-orm';
import { FirstmallDbModule } from '@project-lc/firstmall-db';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [FirstmallDbModule],
      controllers: [AppController],
      providers: [AppService, PrismaService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Welcome to api!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController).toBeDefined();
    });
  });
});
