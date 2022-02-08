import { Injectable } from '@nestjs/common';
import { Broadcaster } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { broadcasterProductPromotionDto } from '@project-lc/shared-types';

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
}
