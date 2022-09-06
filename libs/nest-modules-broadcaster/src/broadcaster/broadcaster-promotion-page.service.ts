import { Injectable } from '@nestjs/common';
import { Broadcaster, BroadcasterPromotionPage, Prisma } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  BroadcasterPromotionPageDto,
  BroadcasterPromotionPageListRes,
  BroadcasterPromotionPageUpdateDto,
  FindManyDto,
  GetRankingBy,
  GetRankingDto,
  type GetRankingRes,
  type PromotionPagePromotionGoodsRes,
} from '@project-lc/shared-types';
import { getKkshowWebHost } from '@project-lc/utils';

@Injectable()
export class BroadcasterPromotionPageService {
  constructor(private readonly prisma: PrismaService) {}

  private async find(
    opt: Prisma.BroadcasterPromotionPageWhereUniqueInput,
  ): Promise<BroadcasterPromotionPage> {
    return this.prisma.broadcasterPromotionPage.findUnique({ where: opt });
  }

  /** 고유ID별 개별조회 */
  public async findById(
    id: BroadcasterPromotionPage['id'],
  ): Promise<BroadcasterPromotionPage> {
    return this.find({ id });
  }

  /** 방송인고유ID별 개별조회 */
  public async findByBroadcasterId(
    broadcasterId: Broadcaster['id'],
  ): Promise<BroadcasterPromotionPage> {
    return this.find({ broadcasterId });
  }

  /** 방송인 상품홍보중 상품  */
  public async findPromotionGoods(
    broadcasterId: Broadcaster['id'],
    dto: FindManyDto,
  ): Promise<PromotionPagePromotionGoodsRes> {
    const { skip, take } = dto;
    const realTake = take + 1;
    const result = await this.prisma.productPromotion.findMany({
      where: { broadcasterId },
      skip,
      take: realTake,
      select: {
        id: true,
        goods: {
          select: {
            id: true,
            goods_name: true,
            summary: true,
            image: { take: 1, orderBy: { cut_number: 'asc' } },
            options: {
              select: {
                id: true,
                consumer_price: true,
                price: true,
                option1: true,
                option_title: true,
                default_option: true,
              },
            },
          },
        },
      },
    });
    const resResult = result.slice(0, take);
    if (result.length === realTake)
      // 다음 페이지 데이터가 있는 경우
      return {
        nextCursor: skip + take,
        productPromotions: resResult,
      };
    return { nextCursor: undefined, productPromotions: resResult };
  }

  /** 상품홍보페이지 BroadcasterPromotionPage 생성 */
  public async createPromotionPage(
    dto: BroadcasterPromotionPageDto,
  ): Promise<BroadcasterPromotionPage> {
    const { comment, broadcasterId } = dto;
    const promotionPage = await this.prisma.broadcasterPromotionPage.create({
      data: {
        url: `${getKkshowWebHost()}/bc/${broadcasterId}`,
        broadcaster: { connect: { id: broadcasterId } },
        comment,
      },
    });
    return promotionPage;
  }

  /** 상품홍보페이지 수정 */
  public async updatePromotionPage(
    dto: BroadcasterPromotionPageUpdateDto,
  ): Promise<BroadcasterPromotionPage> {
    const { id, ...updateData } = dto;
    const page = await this.prisma.broadcasterPromotionPage.update({
      where: { id },
      data: { ...updateData },
    });
    return page;
  }

  /** 상품홍보페이지 삭제 */
  public async deletePromotionPage(pageId: number): Promise<boolean> {
    await this.prisma.broadcasterPromotionPage.delete({
      where: { id: pageId },
    });
    return true;
  }

  /** 상품홍보페이지 url 중복 확인
   * @return 중복 url이면 true, 중복이 아니면 false
   */
  public async checkPromotionPageUrlDuplicate(url: string): Promise<boolean> {
    const page = await this.prisma.broadcasterPromotionPage.findUnique({
      where: { url },
    });
    if (page) return true;
    return false;
  }

  /** 상품홍보페이지 전체 목록 조회 */
  public async getBroadcasterPromotionPageList(): Promise<BroadcasterPromotionPageListRes> {
    return this.prisma.broadcasterPromotionPage.findMany({
      include: {
        broadcaster: {
          select: { userNickname: true, email: true },
        },
      },
    });
  }

  /** 방송인 id로 상품홍보페이지id 찾거나 생성 */
  public async findOrCreatePromotionPageId({
    broadcasterId,
  }: {
    broadcasterId: Broadcaster['id'];
  }): Promise<BroadcasterPromotionPage['id']> {
    const existPromotionPage = await this.prisma.broadcasterPromotionPage.findUnique({
      where: { broadcasterId },
    });
    if (!existPromotionPage) {
      // 없으면 홍보 페이지 만들기
      const newPromotionPage = await this.prisma.broadcasterPromotionPage.create({
        data: {
          broadcaster: { connect: { id: broadcasterId } },
        },
      });
      return newPromotionPage.id;
    }
    return existPromotionPage.id;
  }

  /** 방송인 기준 구매/선물구매 랭킹 조회 */
  public async getRanking(
    broadcasterId: Broadcaster['id'],
    dto: GetRankingDto,
  ): Promise<GetRankingRes> {
    if (dto.by === GetRankingBy.reviewCount) {
      const reviews = await this.prisma.goodsReview.findMany({
        select: { writer: { select: { nickname: true } } },
        where: { orderItem: { some: { support: { broadcasterId } } } },
      });
      const result: GetRankingRes = [];
      reviews.forEach((review) => {
        const targetIdx = result.findIndex((x) => x.nickname === review.writer.nickname);
        if (targetIdx > -1) {
          result[targetIdx] = {
            ...result[targetIdx],
            _count: result[targetIdx]._count + 1,
          };
        } else {
          result.push({ nickname: review.writer.nickname, _count: 1 });
        }
      });
      return result
        .sort((a, b) => b._sum.price - a._sum.price) // 내림차순 정렬
        .slice(0, dto.take || 5);
    }
    const result = await this.prisma.liveShoppingPurchaseMessage.groupBy({
      by: ['nickname'],
      _sum: { price: true },
      where: {
        nickname: { notIn: ['비회원', '익명의구매자'] },
        broadcaster: { id: broadcasterId },
        giftFlag: dto.by === GetRankingBy.giftPrice || undefined,
      },
    });

    return result
      .sort((a, b) => b._sum.price - a._sum.price) // 내림차순 정렬
      .slice(0, dto.take || 5);
  }
}
