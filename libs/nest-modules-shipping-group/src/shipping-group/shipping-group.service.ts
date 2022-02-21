import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  ShippingGroupDto,
  ShippingOptionDto,
  ShippingSetDto,
} from '@project-lc/shared-types';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { Cache } from 'cache-manager';
import {
  Seller,
  ShippingCost,
  ShippingGroup,
  ShippingOption,
  ShippingSet,
} from '.prisma/client';

export type ShippingGroupResult = ShippingGroup & {
  shippingSets: (ShippingSet & {
    shippingOptions: (ShippingOption & {
      shippingCost: ShippingCost[];
    })[];
  })[];
};

export type ShippingGroupListResult = (ShippingGroup & { _count: { goods: number } })[];

@Injectable()
export class ShippingGroupService extends ServiceBaseWithCache {
  #SHIPPING_GROUP_CACHE_KEY = 'shipping-group';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  // 특정 배송비그룹 정보 조회
  async getOneShippingGroup(groupId: number): Promise<ShippingGroupResult> {
    return this.prisma.shippingGroup.findUnique({
      where: { id: groupId },
      include: {
        shippingSets: {
          include: {
            shippingOptions: {
              include: {
                shippingCost: true,
              },
            },
          },
        },
      },
    });
  }

  // 해당 유저의 배송비정책 목록 조회
  async getShippingGroupList(email: string): Promise<ShippingGroupListResult> {
    return this.prisma.shippingGroup.findMany({
      where: { seller: { email } },
      include: {
        _count: { select: { goods: true } },
      },
    });
  }

  // 배송옵션, 배송가격 생성 &  배송방법에 연결
  async createShippingOption(
    setId: number,
    dto: ShippingOptionDto,
  ): Promise<ShippingOption> {
    const { shippingCost, ...shippingOption } = dto;

    const option = await this.prisma.shippingOption.create({
      data: {
        shippingSet: { connect: { id: setId } },
        ...shippingOption,
        shippingCost: {
          create: [{ ...shippingCost }],
        },
      },
    });
    await this._clearCaches(this.#SHIPPING_GROUP_CACHE_KEY);
    return option;
  }

  // 여러 배송옵션 생성 && 배송방법에 연결
  async createShippingOptions(
    setId: number,
    shippingOptions: ShippingOptionDto[],
  ): Promise<void> {
    await Promise.all(
      shippingOptions.map(async (option) => {
        await this.createShippingOption(setId, option);
      }),
    );
  }

  // 배송설정 생성 && 배송그룹에 연결
  async createShippingSet(groupId: number, dto: ShippingSetDto): Promise<ShippingSet> {
    const { shippingOptions, ...shippingSet } = dto;

    const set = await this.prisma.shippingSet.create({
      data: {
        shippingGroup: { connect: { id: groupId } },
        ...shippingSet,
      },
    });

    const options: ShippingOptionDto[] = shippingOptions.map((opt) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tempId, ...values } = opt;
      return { ...values };
    });

    await this.createShippingOptions(set.id, options);
    await this._clearCaches(this.#SHIPPING_GROUP_CACHE_KEY);

    return set;
  }

  // 여러 배송설정 생성 && 배송그룹에 연결
  async createShippingSets(
    groupId: number,
    shippingSets: ShippingSetDto[],
  ): Promise<void> {
    await Promise.all(
      shippingSets.map(async (set) => {
        await this.createShippingSet(groupId, set);
      }),
    );
  }

  // 배송그룹 생성
  // 해당 함수 내부에서 배송설정 생성 -> 배송옵션 생성 -> 배송가격 생성을 순차적으로 호출함
  async createShippingGroup(
    sellerEmail: string,
    dto: ShippingGroupDto,
  ): Promise<
    ShippingGroup & {
      seller: Seller;
    }
  > {
    const { shippingSets, ...shippingGroup } = dto;

    const group = await this.prisma.shippingGroup.create({
      include: {
        seller: true,
      },
      data: {
        seller: { connect: { email: sellerEmail } },
        ...shippingGroup,
      },
    });

    const sets: ShippingSetDto[] = shippingSets.map((set) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tempId, ...values } = set;
      return { ...values };
    });

    await this.createShippingSets(group.id, sets);
    await this._clearCaches(this.#SHIPPING_GROUP_CACHE_KEY);
    return group;
  }

  // 배송그룹 삭제
  async deleteShippingGroup(groupId: number): Promise<boolean> {
    await this.prisma.shippingGroup.delete({ where: { id: groupId } });
    await this._clearCaches(this.#SHIPPING_GROUP_CACHE_KEY);
    return true;
  }
}
