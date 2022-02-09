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
}
