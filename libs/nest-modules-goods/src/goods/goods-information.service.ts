import { Injectable } from '@nestjs/common';
import { Goods, GoodsInformationNotice } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { GoodsInformationNoticeDto } from '@project-lc/shared-types';

@Injectable()
export class GoodsInformationService {
  constructor(private readonly prisma: PrismaService) {}

  // ******************************
  // 상품 정보 제공 고시 각 개별 상품별 정보
  // ******************************
  /** 상품 제공 고시 정보 등록 */
  async registGoodsInformationNotice(
    dto: GoodsInformationNoticeDto,
  ): Promise<GoodsInformationNotice> {
    return this.prisma.goodsInformationNotice.create({
      data: {
        goodsId: dto.goodsId,
        contents: dto.contents,
      },
    });
  }

  /** 상품 제공 공시 수정 */
  async updateGoodsInformationNotice(
    goodsId: Goods['id'],
    dto: GoodsInformationNoticeDto,
  ): Promise<GoodsInformationNotice> {
    return this.prisma.goodsInformationNotice.update({
      where: { goodsId },
      data: { goodsId: dto.goodsId, contents: dto.contents },
    });
  }
}
