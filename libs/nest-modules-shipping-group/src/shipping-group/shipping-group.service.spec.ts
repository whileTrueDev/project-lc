import { CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Seller, ShippingGroup } from '@prisma/client';
import { CacheConfig } from '@project-lc/nest-core';
import { PrismaModule } from '@project-lc/prisma-orm';
import { ShippingGroupDto } from '@project-lc/shared-types';
import { ShippingGroupService } from './shipping-group.service';

const TEST_USER = {
  id: 3,
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
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.registerAsync({
          isGlobal: true,
          useClass: CacheConfig,
        }),
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
    await __prisma.seller.delete({ where: { id: TEST_USER.id } });
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
        TEST_USER.id,
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
