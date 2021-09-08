import { Test, TestingModule } from '@nestjs/testing';
import { NickNameAndPrice, NickNameAndText, PriceSum } from '@project-lc/shared-types';
import { PrismaModule } from '@project-lc/prisma-orm';
import { PrismaClient } from '@prisma/client';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('overlay test', () => {
  let __prisma: PrismaClient;
  let service: AppService;

  const topRanks: NickNameAndPrice[] = [
    {
      nickname: 'testNickname1',
      _sum: { price: 49000 },
    },
    {
      nickname: 'testNickname2',
      _sum: { price: 3900 },
    },
    {
      nickname: 'testNickname3',
      _sum: { price: 45000 },
    },
    {
      nickname: 'testNickname4',
      _sum: { price: 50000 },
    },
  ];

  const messageAndNickname: NickNameAndText[] = [
    {
      nickname: 'testNickname1',
      text: '반갑습니다',
    },
    {
      nickname: 'testNickname2',
      text: '2반갑습니다2',
    },
    {
      nickname: 'testNickname3',
      text: '3반갑습니다3',
    },
    {
      nickname: 'testNickname4',
      text: '4반갑습니다4',
    },
  ];

  const totalSoldPrice: PriceSum = {
    _sum: {
      price: 147900,
    },
  };
  beforeAll(async () => {
    __prisma = new PrismaClient();

    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    service = module.get<AppService>(AppService);

    await __prisma.liveCommerceRanking.createMany({
      data: [
        {
          nickname: 'testNickname1',
          text: '반갑습니다',
          price: 49000,
          phoneCallEventFlag: '1',
          loginFlag: '1',
        },
        {
          nickname: 'testNickname2',
          text: '2반갑습니다2',
          price: 3900,
          phoneCallEventFlag: '1',
          loginFlag: '1',
        },
        {
          nickname: 'testNickname3',
          text: '3반갑습니다3',
          price: 45000,
          phoneCallEventFlag: '1',
          loginFlag: '1',
        },
        {
          nickname: 'testNickname4',
          text: '4반갑습니다4',
          price: 50000,
          phoneCallEventFlag: '1',
          loginFlag: '1',
        },
      ],
    });
  });

  afterAll(async () => {
    await __prisma.liveCommerceRanking.deleteMany({ where: { loginFlag: '1' } });
    await __prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findTopRankings', () => {
    it('should return Rankings', async () => {
      const result = await service.getRanking();
      expect(result).toEqual(topRanks);
    });
  });

  describe('getTotalSoldPrice', () => {
    it('should return total sold price', async () => {
      const result = await service.getTotalSoldPrice();
      expect(result).toEqual(totalSoldPrice);
    });
  });

  describe('getMessageAndNickname', () => {
    it('should return getMessageAndNickname', async () => {
      const result = await service.getMessageAndNickname();
      expect(result).toEqual(messageAndNickname);
    });
  });
});
