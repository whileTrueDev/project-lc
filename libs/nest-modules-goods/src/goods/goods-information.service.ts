import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  GoodsInformationSubjectDto,
  GoodsInformationNoticeDto,
} from '@project-lc/shared-types';
import { GoodsInformationNotice, GoodsInformationSubject } from '@prisma/client';

@Injectable()
export class GoodsInformationService {
  constructor(private readonly prisma: PrismaService) {}

  /** 상품 제공 공시 등록 */
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

  /** 상품 제공고시  품목 등록 */
  async registGoodsInformationSubject(
    dto: GoodsInformationSubjectDto,
  ): Promise<GoodsInformationSubject> {
    return this.prisma.goodsInformationSubject.create({
      data: {
        subject: dto.subject,
        items: dto.items,
      },
    });
  }

  /** 상품 제공 공시 수정 */
  async updateGoodsInformationNotice(
    dto: GoodsInformationNoticeDto,
  ): Promise<GoodsInformationNotice> {
    return this.prisma.goodsInformationNotice.update({
      where: {
        id: dto.id,
      },
      data: {
        goodsId: dto.goodsId,
        contents: dto.contents,
      },
    });
  }

  /** 상품 제공 고시 품목 수정 */
  async updateGoodsInformationSubject(
    dto: GoodsInformationSubjectDto,
  ): Promise<GoodsInformationSubject> {
    return this.prisma.goodsInformationSubject.update({
      where: {
        id: dto.id,
      },
      data: {
        subject: dto.subject,
        items: dto.items,
      },
    });
  }
}
