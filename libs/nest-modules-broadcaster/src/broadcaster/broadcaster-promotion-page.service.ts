import { Injectable } from '@nestjs/common';
import { Broadcaster } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  broadcasterProductPromotionDto,
  BroadcasterPromotionPageDto,
  BroadcasterPromotionPageUpdateDto,
} from '@project-lc/shared-types';

@Injectable()
export class BroadcasterPromotionPageService {
  constructor(private readonly prisma: PrismaService) {}

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
  public async createPromotionPage(dto: BroadcasterPromotionPageDto): Promise<any> {
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
  public async updatePromotionPage(dto: BroadcasterPromotionPageUpdateDto): Promise<any> {
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
}
