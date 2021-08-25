import { Test, TestingModule } from '@nestjs/testing';
import { Goods, PrismaClient } from '@prisma/client';
import { PrismaModule } from '@project-lc/prisma-orm';
import { GoodsService } from './goods.service';

describe('GoodsService', () => {
  let __prisma: PrismaClient;
  let service: GoodsService;

  const TEST_USER_EMAIL = 'test@test.com';
  const TEST_CONFIRMATION_GOODS_CONNECTION_ID = 999;
  let TEST_GOODS: Goods;

  beforeAll(async () => {
    __prisma = new PrismaClient();

    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [GoodsService],
    }).compile();

    service = module.get<GoodsService>(GoodsService);

    // 테스트용 더미 판매자(seller) 생성
    await __prisma.seller.create({
      data: {
        email: TEST_USER_EMAIL,
        name: 'test',
        password: 'test',
      },
    });

    // 테스트용 더미 Goods, GoodsConfirmation 생성
    TEST_GOODS = await __prisma.goods.create({
      data: {
        seller: {
          connect: {
            email: TEST_USER_EMAIL,
          },
        },
        image: 'dummy.jpg',
        common_contents: 'dummy common_contents',
        goods_name: 'dummy goods name',
        summary: 'dummy',
        confirmation: {
          create: {
            id: 1,
            status: 'confirmed',
            firstmallGoodsConnectionId: TEST_CONFIRMATION_GOODS_CONNECTION_ID,
          },
        },
      },
    });
  });

  afterAll(async () => {
    await __prisma.goodsConfirmation.delete({
      where: { id: 1 },
    });
    await __prisma.goods.delete({
      where: { id: TEST_GOODS.id },
      include: { confirmation: true },
    });
    await __prisma.seller.delete({ where: { email: TEST_USER_EMAIL } });
    await __prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMyGoodsIds', () => {
    it('should return empty array', async () => {
      const goodsIds = await service.findMyGoodsIds('UNKOWN_EMAIL@asdf.com');
      expect(goodsIds.length).toBe(0);
      expect(goodsIds).toEqual([]);
    });
    it('should return array of goods ids (numbers)', async () => {
      const goodsIds = await service.findMyGoodsIds(TEST_USER_EMAIL);
      expect(goodsIds).toEqual([TEST_CONFIRMATION_GOODS_CONNECTION_ID]);
    });
  });
});
