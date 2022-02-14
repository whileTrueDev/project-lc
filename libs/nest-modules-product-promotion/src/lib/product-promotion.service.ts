import { Injectable } from '@nestjs/common';
import { ProductPromotion } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateProductPromotionDto,
  ProductPromotionListData,
  UpdateProductPromotionDto,
} from '@project-lc/shared-types';

@Injectable()
export class ProductPromotionService {
  constructor(private readonly prisma: PrismaService) {}

  /** 상품홍보 생성 */
  public async createProductPromotion(
    dto: CreateProductPromotionDto,
  ): Promise<ProductPromotion> {
    const { goodsId, broadcasterPromotionPageId, ...rest } = dto;
    const data = await this.prisma.productPromotion.create({
      data: {
        ...rest,
        goods: { connect: { id: goodsId } },
        broadcasterPromotionPage: { connect: { id: broadcasterPromotionPageId } },
      },
    });
    return data;
  }

  /** 상품홍보 수정 */
  public async updateProductPromotion(
    dto: UpdateProductPromotionDto,
  ): Promise<ProductPromotion> {
    const { id, goodsId, broadcasterPromotionPageId, ...rest } = dto;

    return this.prisma.productPromotion.update({
      where: { id },
      data: {
        ...rest,
        goods: { connect: goodsId ? { id: goodsId } : undefined },
        broadcasterPromotionPage: {
          connect: broadcasterPromotionPageId
            ? { id: broadcasterPromotionPageId }
            : undefined,
        },
      },
    });
  }

  /** 상품홍보 삭제 */
  public async deleteProductPromotion(id: number): Promise<boolean> {
    await this.prisma.productPromotion.delete({ where: { id } });
    return true;
  }

  /** 특정 방송인홍보페이지에 등록된 상품홍보목록 조회
   * @param pageId: 방송인홍보페이지 id
   */
  public async findProductPromotionListByPromotionPageId(
    pageId: number,
  ): Promise<ProductPromotionListData> {
    const data = await this.prisma.productPromotion.findMany({
      where: { broadcasterPromotionPageId: pageId },
      include: {
        goods: {
          select: {
            goods_name: true,
            seller: {
              select: { name: true, sellerShop: { select: { shopName: true } } },
            },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    return data;
  }

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
