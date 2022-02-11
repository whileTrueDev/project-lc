import { Injectable } from '@nestjs/common';
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
  public async createProductPromotion(dto: CreateProductPromotionDto): Promise<any> {
    const { goodsId, broadcasterPromotionPageId, ...rest } = dto;
    return this.prisma.productPromotion.create({
      data: {
        ...rest,
        goods: { connect: { id: goodsId } },
        broadcasterPromotionPage: { connect: { id: broadcasterPromotionPageId } },
      },
    });
  }

  /** 상품홍보 수정 */
  public async updateProductPromotion(dto: UpdateProductPromotionDto): Promise<any> {
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
}
