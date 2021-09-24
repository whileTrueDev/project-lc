import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { GoodsConfirmationDto } from '@project-lc/shared-types';
import { SellerSettlementAccount, SellerBusinessRegistration } from '@prisma/client';

export type AdminSettlementInfoType = {
  sellerSettlementAccount: SellerSettlementAccount[];
  sellerBusinessRegistration: SellerBusinessRegistration[];
};

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // 관리자 페이지 정산 데이터
  public async getSettlementInfo() {
    // 전체 광고주를 기준으로 merge 한다.
    const users = await this.prisma.seller.findMany({
      include: {
        sellerBusinessRegistration: {
          orderBy: {
            id: 'desc',
          },
          take: 1,
        },
        sellerSettlementAccount: {
          orderBy: {
            id: 'desc',
          },
          take: 1,
        },
      },
    });

    const result = this.preprocessSettlementInfo(users);
    return result;
  }

  // 정산정보 전처리
  private preprocessSettlementInfo(users: any) {
    const result: AdminSettlementInfoType = {
      sellerSettlementAccount: [],
      sellerBusinessRegistration: [],
    };

    // 단순 데이터를 전달하지 않고 필요한 데이터의형태로 정제해야함.
    users.forEach(({ sellerSettlementAccount, sellerBusinessRegistration }) => {
      if (sellerSettlementAccount.length > 0) {
        result.sellerSettlementAccount.push(sellerSettlementAccount[0]);
      }
      if (sellerBusinessRegistration.length > 0) {
        result.sellerBusinessRegistration.push(sellerBusinessRegistration[0]);
      }
    });

    return result;
  }

  // 관리자 페이지 상품검수 데이터, 상품검수가 완료되지 않은 상태일 경우,
  public async getGoodsInfo({ sort, direction }) {
    const items = await this.prisma.goods.findMany({
      orderBy: [{ [sort]: direction }],
      where: {
        confirmation: {
          status: 'waiting',
        },
      },
      include: {
        options: {
          include: {
            supply: true,
          },
        },
        confirmation: true,
        ShippingGroup: true,
      },
    });
    const list = items.map((item) => {
      const defaultOption = item.options.find((opt) => opt.default_option === 'y');
      return {
        id: item.id,
        sellerId: item.sellerId,
        goods_name: item.goods_name,
        runout_policy: item.runout_policy,
        shipping_policy: item.shipping_policy,
        regist_date: item.regist_date,
        update_date: item.update_date,
        goods_status: item.goods_status,
        goods_view: item.goods_view,
        default_price: defaultOption.price, // 판매가(할인가)
        default_consumer_price: defaultOption.consumer_price, // 소비자가(미할인가)
        confirmation: item.confirmation,
        shippingGroup: item.ShippingGroup
          ? {
              id: item.ShippingGroup.id,
              shipping_group_name: item.ShippingGroup.shipping_group_name,
            }
          : undefined,
      };
    });

    return {
      items: list,
      totalItemCount: items.length,
    };
  }

  public async setGoodsConfirmation(dto: GoodsConfirmationDto) {
    const goodsConfirmation = await this.prisma.goodsConfirmation.update({
      where: { goodsId: dto.goodsId },
      data: {
        firstmallGoodsConnectionId: dto.firstmallGoodsConnectionId,
        status: dto.status,
      },
    });

    if (!goodsConfirmation) {
      throw new Error(`승인 상태 변경불가`);
    }

    return goodsConfirmation;
  }

  public async getOneGoods(goodsId: string | number) {
    return this.prisma.goods.findFirst({
      where: {
        id: Number(goodsId),
      },
      include: {
        options: { include: { supply: true } },
        ShippingGroup: {
          include: {
            shippingSets: {
              include: {
                shippingOptions: {
                  include: { shippingCost: true },
                },
              },
            },
          },
        },
        confirmation: true,
        image: true,
        GoodsInfo: true,
      },
    });
  }
}
