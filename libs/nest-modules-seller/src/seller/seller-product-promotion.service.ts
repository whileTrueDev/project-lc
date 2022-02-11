import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class SellerProductPromotionService {
  constructor(private readonly prisma: PrismaService) {}

  public async checkIsPromotionProductFmGoodsSeq(fmGoodsSeq: number): Promise<boolean> {
    const productPromotionFmGoodsSeq = await this.prisma.productPromotion.findFirst({
      where: {
        fmGoodsSeq: Number(fmGoodsSeq),
      },
    });
    if (productPromotionFmGoodsSeq) return true;
    return false;
  }
}
