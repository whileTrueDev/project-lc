import { Injectable } from '@nestjs/common';
import { Goods, ProductPromotion } from '@prisma/client';
import { BroadcasterPromotionPageService } from '@project-lc/nest-modules-broadcaster';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateProductPromotionDto,
  ProductPromotionListData,
  UpdateProductPromotionDto,
} from '@project-lc/shared-types';

@Injectable()
export class ProductPromotionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly promotionPageService: BroadcasterPromotionPageService,
  ) {}

  /** 상품홍보 생성 */
  public async createProductPromotion(
    dto: CreateProductPromotionDto,
  ): Promise<ProductPromotion> {
    const { goodsId, broadcasterPromotionPageId, broadcasterId, ...rest } = dto;

    let promotionPageId = broadcasterPromotionPageId;
    if (!promotionPageId) {
      promotionPageId = await this.promotionPageService.findOrCreatePromotionPageId({
        broadcasterId,
      });
    }
    const data = await this.prisma.productPromotion.create({
      data: {
        ...rest,
        goods: { connect: { id: goodsId } },
        broadcasterPromotionPage: { connect: { id: promotionPageId } },
        broadcaster: { connect: { id: broadcasterId } },
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

  /**
   * 전달받은 goodsIds 배열에 해당하는 '상품홍보' 목록 조회
   * @param goodsIds 상품 고유번호 GoodsId 배열 (productPromotion.goodsId)
   */
  public async findProductPromotionsByGoodsIds(
    goodsIds: Goods['id'][],
  ): Promise<ProductPromotion[]> {
    const _goodsIds = goodsIds.map((s) => Number(s)).filter((x) => !!x);
    return this.prisma.productPromotion.findMany({
      where: { goodsId: { in: _goodsIds } },
    });
  }
}
