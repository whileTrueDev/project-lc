import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ServiceBaseWithCache, UserPayload } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  LiveShoppingParamsDto,
  LiveShoppingRegistDTO,
  LiveShoppingsWithBroadcasterAndGoodsName,
  LiveShoppingFmGoodsSeq,
  LiveShoppingId,
} from '@project-lc/shared-types';
import { throwError } from 'rxjs';
import { LiveShopping } from '@prisma/client';
import { Cache } from 'cache-manager';

@Injectable()
export class LiveShoppingService extends ServiceBaseWithCache {
  #LIVESHOPPING_CACHE_KEY = 'live-shoppings';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  /** 라이브쇼핑 생성 */
  async createLiveShopping(
    sellerId: UserPayload['id'],
    dto: LiveShoppingRegistDTO,
  ): Promise<{ liveShoppingId: number }> {
    const userId = await this.prisma.seller.findFirst({
      where: { id: sellerId },
      select: { id: true },
    });
    const liveShopping = await this.prisma.liveShopping.create({
      data: {
        seller: { connect: { id: userId.id } },
        requests: dto.requests,
        desiredPeriod: dto.desiredPeriod,
        desiredCommission: dto.desiredCommission || '0.00',
        goods: { connect: { id: dto.goods_id } },
        sellerContacts: { connect: { id: dto.contactId } },
      },
    });
    await this._clearCaches(this.#LIVESHOPPING_CACHE_KEY);
    return { liveShoppingId: liveShopping.id };
  }

  /** 라이브쇼핑 삭제 */
  async deleteLiveShopping(liveShoppingId: { liveShoppingId: number }): Promise<boolean> {
    const doDelete = await this.prisma.liveShopping.delete({
      where: {
        id: liveShoppingId.liveShoppingId,
      },
    });

    if (!doDelete) {
      throwError('라이브 쇼핑 삭제 실패');
    }
    await this._clearCaches(this.#LIVESHOPPING_CACHE_KEY);
    return true;
  }

  async getRegisteredLiveShoppings(
    sellerId: UserPayload['id'],
    dto: LiveShoppingParamsDto,
  ): Promise<LiveShopping[]> {
    // 자신의 id를 반환하는 쿼리 수행하기
    const { id, goodsIds } = dto;
    return this.prisma.liveShopping.findMany({
      where: {
        id: id ? Number(id) : undefined,
        goodsId:
          goodsIds?.length >= 1
            ? { in: goodsIds.map((goodsid) => Number(goodsid)) }
            : undefined,
        seller: {
          id: sellerId,
        },
      },
      include: {
        goods: {
          select: {
            goods_name: true,
            summary: true,
          },
        },
        seller: {
          select: {
            sellerShop: true,
          },
        },
        broadcaster: {
          select: {
            userNickname: true,
            channels: true,
          },
        },
        liveShoppingVideo: {
          select: { youtubeUrl: true },
        },
      },
    });
  }

  /**
   *
   * @author m'baku
   * @description 해당 방송인에게 매칭된 모든 라이브 쇼핑에 연결된 상품들의 fmGoodsSeq 반환받는다
   * @param broadcasterId
   * @returns fmGoodsSeq
   */
  async getFmGoodsSeqsLinkedToLiveShoppings(
    broadcasterId: number,
  ): Promise<LiveShoppingFmGoodsSeq[]> {
    const fmGoodsSeqs = await this.prisma.liveShopping.findMany({
      where: {
        broadcasterId: broadcasterId ? Number(broadcasterId) : undefined,
      },
      select: {
        fmGoodsSeq: true,
      },
    });

    return fmGoodsSeqs;
  }

  async getBroadcasterRegisteredLiveShoppings(
    broadcasterId: number,
  ): Promise<LiveShopping[]> {
    // 자신의 id를 반환하는 쿼리 수행하기
    return this.prisma.liveShopping.findMany({
      where: {
        broadcasterId: Number(broadcasterId),
      },
      include: {
        goods: {
          select: {
            goods_name: true,
            summary: true,
          },
        },
        seller: {
          select: {
            sellerShop: true,
          },
        },
        broadcaster: {
          select: {
            userNickname: true,
            channels: true,
          },
        },
        liveShoppingVideo: {
          select: { youtubeUrl: true },
        },
      },
      orderBy: [
        {
          sellStartDate: 'desc',
        },
        {
          id: 'desc',
        },
      ],
    });
  }

  async getLiveShoppingsForOverlayController(): Promise<
    LiveShoppingsWithBroadcasterAndGoodsName[]
  > {
    // 현재 시간에 3시간 뺀 시간보다 방송종료 시간이 더 이후인 라이브쇼핑들 다 불러옴
    const now = new Date();
    now.setHours(now.getHours() - 3);

    return this.prisma.liveShopping.findMany({
      where: {
        progress: 'confirmed',
        broadcastEndDate: { gte: now },
      },
      select: {
        id: true,
        broadcaster: {
          select: {
            email: true,
            userNickname: true,
            overlayUrl: true,
          },
        },
        goods: {
          select: {
            goods_name: true,
          },
        },
        broadcastStartDate: true,
        broadcastEndDate: true,
      },
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
      select: {
        id: true,
      },
      orderBy: {
        broadcastEndDate: 'asc',
      },
    });
  }

  /** 특정 라이브 쇼핑의 현황(응원메시지 데이터) 조회 - 생성일 내림차순 조회(최신순)
   * @param liveShoppingId 라이브쇼핑 고유id
   */
  /** 해당 fmGoodsSeq가 라이브쇼핑에 등록되어 있으면 true를 반환 */
  async checkIsLiveShoppingFmGoodsSeq(fmGoodsSeq: number): Promise<boolean> {
    const liveShoppingFmGoodsSeq = await this.prisma.liveShopping.findFirst({
      where: {
        fmGoodsSeq: Number(fmGoodsSeq),
      },
    });
    if (liveShoppingFmGoodsSeq) return true;
    return false;
  }

  /**
   * 전달된 fmGoodsSeq 배열에 해당하는 라이브쇼핑 목록 정보 조회
   * @param fmGoodsSeqs 퍼스트몰 상품 고유번호 fmGoodsSeq 배열 (liveShopping.fmGoodsSeq)
   */
  async findLiveShoppingsByGoodsIds(fmGoodsSeqs: number[]): Promise<LiveShopping[]> {
    const _fmGoodsSeqs = fmGoodsSeqs.map((s) => Number(s)).filter((x) => !!x);
    return this.prisma.liveShopping.findMany({
      where: { fmGoodsSeq: { in: _fmGoodsSeqs } },
    });
  }
}
