import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateProductPromotionDto,
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
}
