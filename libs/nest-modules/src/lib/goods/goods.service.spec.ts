import { Test, TestingModule } from '@nestjs/testing';
import { Goods, GoodsView, PrismaClient } from '@prisma/client';
import { PrismaModule } from '@project-lc/prisma-orm';
import {
  SellerGoodsSortColumn,
  SellerGoodsSortDirection,
} from '@project-lc/shared-types';
import { nanoid } from 'nanoid';
import { GoodsService } from './goods.service';

describe('GoodsService', () => {
  let __prisma: PrismaClient;
  let service: GoodsService;

  const TEST_USER_EMAIL = `${nanoid(2)}test@test.com`;
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
        image: { create: [] },
        common_contents: 'dummy common_contents',
        goods_name: 'dummy goods name',
        summary: 'dummy',
        options: {
          create: [
            {
              default_option: 'y',
              price: 99999,
              consumer_price: 99999,
              supply: { create: { stock: 99999 } },
            },
          ],
        },
        confirmation: {
          create: {
            status: 'confirmed',
            firstmallGoodsConnectionId: TEST_CONFIRMATION_GOODS_CONNECTION_ID,
          },
        },
      },
    });
  });

  afterAll(async () => {
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

  describe('getGoodsList', () => {
    it('should have 1 item and totalItemCount : 1', async () => {
      const goodsListData = await service.getGoodsList({
        email: TEST_USER_EMAIL,
        page: 0,
        itemPerPage: 10,
        sort: SellerGoodsSortColumn.REGIST_DATE,
        direction: SellerGoodsSortDirection.DESC,
      });

      expect(goodsListData.items).toHaveLength(1);
      expect(goodsListData.totalItemCount).toBe(1);
    });
  });

  describe('changeGoodsView', () => {
    it('goos_view should be notLook', async () => {
      await service.changeGoodsView(TEST_GOODS.id, GoodsView.notLook);
      const goodsListData = await service.getGoodsList({
        email: TEST_USER_EMAIL,
        page: 0,
        itemPerPage: 10,
        sort: SellerGoodsSortColumn.REGIST_DATE,
        direction: SellerGoodsSortDirection.DESC,
      });
      expect(goodsListData.items[0].goods_view).toBe(GoodsView.notLook);
    });
  });

  describe('deleteLcGoods', () => {
    it('goods should be deleted', async () => {
      await service.deleteLcGoods({ email: TEST_USER_EMAIL, ids: [TEST_GOODS.id] });
      const goodsListData = await service.getGoodsList({
        email: TEST_USER_EMAIL,
        page: 0,
        itemPerPage: 10,
        sort: SellerGoodsSortColumn.REGIST_DATE,
        direction: SellerGoodsSortDirection.DESC,
      });

      expect(goodsListData.items).toHaveLength(0);
      expect(goodsListData.totalItemCount).toBe(0);
    });
  });
});
