import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { CreateProductPromotionDto } from '@project-lc/shared-types';

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
}
