import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Seller, ShippingGroup } from '@prisma/client';
import { PrismaModule } from '@project-lc/prisma-orm';
import { ShippingGroupDto } from '@project-lc/shared-types';
import { nanoid } from 'nanoid';
import * as redisCacheStore from 'cache-manager-ioredis';
import { ShippingGroupService } from './shipping-group.service';

const TEST_USER = {
  email: `${nanoid(2)}test@test.com`,
  name: 'test',
  password: 'test',
};

const testShippingGroupData: ShippingGroupDto = {
  shipping_group_name: 'test shipping group name',
  shipping_calcul_type: 'free',
  shipping_calcul_free_yn: 'N',
  shipping_std_free_yn: 'N',
  shipping_add_free_yn: 'N',
  baseAddress: '기본 주소',
  detailAddress: '상세 주소',
  postalCode: '1234',
  shippingSets: [],
};

describe('ShippingGroupService', () => {
  let __prisma: PrismaClient;
  let service: ShippingGroupService;

  beforeAll(async () => {
    __prisma = new PrismaClient();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        CacheModule.register({ isGlobal: true, store: redisCacheStore }),
      ],
      providers: [ShippingGroupService],
    }).compile();

    service = module.get<ShippingGroupService>(ShippingGroupService);

    // 테스트용 더미 판매자(seller) 생성
    await __prisma.seller.create({
      data: TEST_USER,
    });
  });

  afterAll(async () => {
    await __prisma.seller.delete({ where: { email: TEST_USER.email } });
    await __prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shippingGroup', () => {
    let shippingGroup: ShippingGroup & {
      seller: Seller;
    };
    it('should create shippingGroup', async () => {
      shippingGroup = await service.createShippingGroup(
        TEST_USER.email,
        testShippingGroupData,
      );

      expect(shippingGroup.shipping_group_name).toBe(
        testShippingGroupData.shipping_group_name,
      );
    });

    it('should delete shippingGroup', async () => {
      const result = await service.deleteShippingGroup(shippingGroup.id);

      expect(result).toBe(true);
    });
  });
});
