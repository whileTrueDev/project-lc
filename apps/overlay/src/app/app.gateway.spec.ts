import { Test, TestingModule } from '@nestjs/testing';
import { Socket } from 'socket.io';
import { OverlayModule } from '@project-lc/nest-modules';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';

describe('overlay socket server side test', () => {
  let appGateway: AppGateway;
  let socket: Socket;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OverlayModule],
      controllers: [AppController],
      providers: [AppGateway],
    }).compile();

    appGateway = module.get<AppGateway>(AppGateway);
  });

  it('should be defined', () => {
    expect(appGateway).toBeDefined();
  });

  describe('getTotalSoldPrice', () => {
    it('should return ', async (done) => {
      await appGateway.afterInit();
      done();
    });
  });
});
