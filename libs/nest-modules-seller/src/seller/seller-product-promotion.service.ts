import { Injectable } from '@nestjs/common';
import { ProductPromotion } from '@prisma/client';
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

  /**
   * 전달받은 fmGoodsSeq 배열에 해당하는 '상품홍보' 목록 조회
   * @param fmGoodsSeqs 퍼스트몰 상품 고유번호 fmGoodsSeq 배열 (productPromotion.fmGoodsSeq)
   */
  public async findProductPromotionsByGoodsIds(
    fmGoodsSeqs: number[],
  ): Promise<ProductPromotion[]> {
    const _fmGoodsSeqs = fmGoodsSeqs.map((s) => Number(s)).filter((x) => !!x);
    return this.prisma.productPromotion.findMany({
      where: { fmGoodsSeq: { in: _fmGoodsSeqs } },
    });
  }
}
