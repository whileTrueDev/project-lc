import { Injectable } from '@nestjs/common';
import { GoodsInformationSubject } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  GoodsInformationSubjectDto,
  GoodsInformationSubjectRes,
} from '@project-lc/shared-types';

@Injectable()
export class GoodsInformationSubjectService {
  constructor(private readonly prisma: PrismaService) {}

  /** 상품 제공고시 품목 등록 */
  async create(dto: GoodsInformationSubjectDto): Promise<GoodsInformationSubject> {
    return this.prisma.goodsInformationSubject.create({
      data: {
        subject: dto.subject,
        items: dto.items,
      },
    });
  }

  /** 상품 제공 고시 품목 수정 */
  async update(
    id: GoodsInformationSubject['id'],
    dto: GoodsInformationSubjectDto,
  ): Promise<GoodsInformationSubject> {
    return this.prisma.goodsInformationSubject.update({
      where: { id },
      data: { subject: dto.subject, items: dto.items },
    });
  }

  /** 상품 제공 고시 품목 찾기 */
  async findOne(id: number): Promise<GoodsInformationSubjectRes> {
    const result = (await this.prisma.goodsInformationSubject.findFirst({
      where: { id },
    })) as GoodsInformationSubjectRes;
    return result;
  }

  /** 상품 제공 고시 품목 목록 조회 */
  async findAll(): Promise<GoodsInformationSubjectRes[]> {
    const result =
      (await this.prisma.goodsInformationSubject.findMany()) as GoodsInformationSubjectRes[];
    return result;
  }
}
