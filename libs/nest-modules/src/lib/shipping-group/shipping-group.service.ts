import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { ShippingGroup, ShippingOption, ShippingSet } from '@project-lc/shared-types';

@Injectable()
export class ShippingGroupService {
  constructor(private readonly prisma: PrismaService) {}

  // 해당 유저의 배송비정책 목록 조회
  async getShippingGroupList(email: string) {
    return this.prisma.shippingGroup.findMany({
      where: {
        seller: {
          email,
        },
      },
    });
  }

  // 배송옵션, 배송가격 생성 &  배송방법에 연결
  async createShippingOption(setId: number, dto: ShippingOption) {
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
    return option;
  }

  // 여러 배송옵션 생성 && 배송방법에 연결
  async createShippingOptions(setId: number, shippingOptions: ShippingOption[]) {
    await Promise.all(
      shippingOptions.map(async (option) => {
        await this.createShippingOption(setId, option);
      }),
    );
  }

  // 배송설정 생성 && 배송그룹에 연결
  async createShippingSet(groupId: number, dto: ShippingSet) {
    const { shippingOptions, ...shippingSet } = dto;

    const set = await this.prisma.shippingSet.create({
      data: {
        shippingGroup: { connect: { id: groupId } },
        ...shippingSet,
      },
    });

    await this.createShippingOptions(set.id, shippingOptions);

    return set;
  }

  // 여러 배송설정 생성 && 배송그룹에 연결
  async createShippingSets(groupId: number, shippingSets: ShippingSet[]) {
    await Promise.all(
      shippingSets.map(async (set) => {
        await this.createShippingSet(groupId, set);
      }),
    );
  }

  // 배송그룹 생성
  // 해당 함수 내부에서 배송설정 생성 -> 배송옵션 생성 -> 배송가격 생성을 순차적으로 호출함
  async createShippingGroup(sellerEmail: string, dto: ShippingGroup) {
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

    await this.createShippingSets(group.id, shippingSets);
    return group;
  }

  // 배송그룹 삭제
  async deleteShippingGroup(groupId: number) {
    return this.prisma.shippingGroup.delete({ where: { id: groupId } });
  }
}
