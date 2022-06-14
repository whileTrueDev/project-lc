import { Injectable } from '@nestjs/common';
import { Broadcaster, BroadcasterPromotionPage } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  broadcasterProductPromotionDto,
  BroadcasterPromotionPageDto,
  BroadcasterPromotionPageListRes,
  BroadcasterPromotionPageUpdateDto,
} from '@project-lc/shared-types';

@Injectable()
export class BroadcasterPromotionPageService {
  constructor(private readonly prisma: PrismaService) {}

  /** @deprecated */
  public async getFmGoodsSeqsLinkedToProductPromotions(
    id: Broadcaster['id'],
  ): Promise<broadcasterProductPromotionDto[]> {
    const productPromotionFmGoodsSeq =
      await this.prisma.broadcasterPromotionPage.findFirst({
        where: {
          broadcasterId: id,
        },
        select: {
          productPromotions: {
            select: {
              fmGoodsSeq: true,
            },
          },
        },
      });
    const fmGoodsSeqs = productPromotionFmGoodsSeq?.productPromotions || [];

    return fmGoodsSeqs;
  }

  /** 상품홍보페이지 BroadcasterPromotionPage 생성 */
  public async createPromotionPage(
    dto: BroadcasterPromotionPageDto,
  ): Promise<BroadcasterPromotionPage> {
    const { url, broadcasterId } = dto;
    const promotionPage = await this.prisma.broadcasterPromotionPage.create({
      data: {
        url,
        broadcaster: { connect: { id: broadcasterId } },
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
      data: {
        ...updateData,
      },
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
}
