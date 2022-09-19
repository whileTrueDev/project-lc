import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LiveShopping, LiveShoppingMessageSetting } from '@prisma/client';
import { UserPayload } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  FindLiveShoppingDto,
  LiveShoppingId,
  LiveShoppingRegistDTO,
  LiveShoppingsWithBroadcasterAndGoodsName,
  LiveShoppingWithGoods,
  getLiveShoppingIsNowLive,
  LiveShoppingOutline,
  FindNowPlayingLiveShoppingDto,
  LiveShoppingRegistByAdminDto,
} from '@project-lc/shared-types';

@Injectable()
export class LiveShoppingService {
  constructor(private readonly prisma: PrismaService) {}

  /** 라이브쇼핑 생성 */
  async createLiveShopping(
    sellerId: UserPayload['id'],
    dto: LiveShoppingRegistDTO,
  ): Promise<{ liveShoppingId: number }> {
    const userId = await this.prisma.seller.findFirst({
      where: { id: sellerId },
      select: { id: true },
    });

    // 라이브쇼핑 특가 정보 입력한경우 생성
    const createSpecialPrices = {
      create: dto.specialPrices
        ? dto.specialPrices.map((sp) => {
            return {
              specialPrice: sp.specialPrice,
              goodsId: sp.goodsId,
              goodsOptionId: sp.goodsOptionId,
              discountType: sp.discountType,
              discountRate: sp.discountRate,
            };
          })
        : undefined,
    };

    const liveShopping = await this.prisma.liveShopping.create({
      data: {
        seller: { connect: { id: userId.id } },
        requests: dto.requests,
        desiredPeriod: dto.desiredPeriod,
        desiredCommission: dto.desiredCommission || '0.00',
        goods: { connect: { id: dto.goodsId } },
        sellerContacts: { connect: { id: dto.contactId } },
        liveShoppingSpecialPrices: createSpecialPrices,
      },
    });
    return { liveShoppingId: liveShopping.id };
  }

  public async createLiveShoppingByAdmin(
    dto: LiveShoppingRegistByAdminDto,
  ): Promise<LiveShopping> {
    if (dto.externalGoods) {
      const lsWithExternalGoods = await this.prisma.liveShopping.create({
        data: {
          sellerId: dto.sellerId,
          externalGoods: {
            create: { name: dto.externalGoods.name, linkUrl: dto.externalGoods.linkUrl },
          },
        },
      });
      return lsWithExternalGoods;
    }

    const ls = await this.prisma.liveShopping.create({
      data: {
        sellerId: dto.sellerId,
        goodsId: dto.goodsId,
      },
    });
    return ls;
  }

  /** 라이브쇼핑 삭제 */
  async deleteLiveShopping(liveShoppingId: { liveShoppingId: number }): Promise<boolean> {
    const result = await this.prisma.$transaction(async (transac) => {
      const deleted = await transac.liveShopping.delete({
        where: { id: liveShoppingId.liveShoppingId },
      });
      // 카트상품 channel 변경
      await transac.cartItem.updateMany({
        data: { channel: 'normal' },
        where: {
          support: {
            liveShoppingId: liveShoppingId.liveShoppingId,
            AND: { productPromotion: { is: null } },
          },
        },
      });
      // 카트상품 channel 변경
      await transac.cartItem.updateMany({
        data: { channel: 'productPromotion' },
        where: {
          support: {
            liveShoppingId: liveShoppingId.liveShoppingId,
            AND: { productPromotion: { isNot: null } },
          },
        },
      });
      // 해당 라이브쇼핑이 연결된 카트 응원메시지 삭제 (상품홍보가 연결되어있다면 pass)
      await transac.cartItemSupport.deleteMany({
        where: { liveShoppingId: deleted.id, AND: { productPromotion: { is: null } } },
      });
      return true;
    });
    if (!result) throw new InternalServerErrorException('라이브 쇼핑 삭제 실패');
    return result;
  }

  /** 라이브 쇼핑 목록 조회 */
  async findLiveShoppings(dto?: FindLiveShoppingDto): Promise<LiveShoppingWithGoods[]> {
    // 자신의 id를 반환하는 쿼리 수행하기
    const id = dto?.id;
    const goodsIds = dto?.goodsIds;
    const broadcasterId = dto?.broadcasterId;
    const sellerId = dto?.sellerId;
    return this.prisma.liveShopping.findMany({
      where: {
        id: id || undefined,
        broadcasterId: broadcasterId || undefined,
        goodsId:
          goodsIds?.length >= 1
            ? { in: goodsIds.map((goodsid) => Number(goodsid)) }
            : undefined,
        sellerId: sellerId || undefined,
      },
      include: {
        messageSetting: true,
        goods: {
          select: {
            goods_name: true,
            summary: true,
            image: true,
            options: true,
            confirmation: { select: { status: true } },
          },
        },
        seller: { select: { sellerShop: true } },
        broadcaster: {
          select: {
            id: true,
            userName: true,
            userNickname: true,
            email: true,
            avatar: true,
            BroadcasterPromotionPage: true,
            channels: true,
          },
        },
        liveShoppingVideo: { select: { youtubeUrl: true } },
        images: true,
        orderItemSupport: {
          select: {
            orderItem: {
              select: {
                options: { select: { discountPrice: true, quantity: true } },
              },
            },
          },
        },
        liveShoppingSpecialPrices: true,
        externalGoods: true,
        BroadcasterSettlementItems: true,
      },
    });
  }

  /** 현재 판매중(라이브 진행중 포함)인 라이브쇼핑 목록 조회 */
  public async getNowPlayingLiveShopping(
    dto: FindNowPlayingLiveShoppingDto,
  ): Promise<LiveShoppingOutline[]> {
    const liveShoppings = await this.prisma.liveShopping.findMany({
      where: {
        goodsId: dto.goodsIds
          ? { in: dto.goodsIds.map((x) => Number(x)) }
          : dto.goodsId || undefined,
        broadcasterId: dto.broadcasterId || undefined,
        progress: 'confirmed',
      },
      select: {
        id: true,
        goodsId: true,
        goods: {
          select: {
            id: true,
            goods_name: true,
            summary: true,
            image: { take: 1, orderBy: { cut_number: 'asc' } },
            options: true,
          },
        },
        sellStartDate: true,
        sellEndDate: true,
        broadcastStartDate: true,
        broadcastEndDate: true,
        broadcasterId: true,
        progress: true,
        images: true,
        liveShoppingName: true,
        liveShoppingSpecialPrices: {
          select: { id: true, specialPrice: true, goodsId: true, goodsOptionId: true },
        },
      },
    });

    return liveShoppings.filter((liveShopping) => {
      return getLiveShoppingIsNowLive(liveShopping);
    });
  }

  async getLiveShoppingsForOverlayController(): Promise<
    LiveShoppingsWithBroadcasterAndGoodsName[]
  > {
    // 현재 시간에 3시간 뺀 시간보다 방송종료 시간이 더 이후인 라이브쇼핑들 다 불러옴
    const now = new Date();
    now.setHours(now.getHours() - 3);

    const liveShoppings = await this.prisma.liveShopping.findMany({
      where: {
        progress: 'confirmed',
        broadcastEndDate: { gte: now },
      },
      select: {
        id: true,
        broadcaster: {
          select: { email: true, userNickname: true, overlayUrl: true },
        },
        goods: { select: { goods_name: true } },
        broadcastStartDate: true,
        broadcastEndDate: true,
        externalGoods: { select: { name: true } },
      },
    });

    return liveShoppings.map((ls) => {
      // 외부상품으로 진행시 goods_name에 외부상품명을 넣어서 전달
      if (ls?.externalGoods && !ls?.goods) {
        const externalGoodsName = ls.externalGoods.name;
        return { ...ls, goods: { goods_name: externalGoodsName } };
      }
      return ls;
    });
  }

  async getLiveShoppingForOverlay(broadcasterId: number): Promise<LiveShoppingId> {
    const now = new Date();
    now.setHours(now.getHours() - 3);
    return this.prisma.liveShopping.findFirst({
      where: {
        broadcasterId,
        progress: 'confirmed',
        broadcastEndDate: { gte: now },
      },
      select: { id: true },
      orderBy: { broadcastEndDate: 'asc' },
    });
  }

  /** 라이브쇼핑 메시지 세팅 조회 */
  public async findLiveShoppingMsgSetting(
    liveShoppingId: number,
  ): Promise<LiveShoppingMessageSetting> {
    return this.prisma.liveShoppingMessageSetting.findUnique({
      where: { liveShoppingId },
      include: { liveShopping: { select: { goods: { select: { goods_name: true } } } } },
    });
  }
}
