import { Injectable } from '@nestjs/common';
import { GoodsReview } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { GoodsReviewCreateDto } from '@project-lc/shared-types';

@Injectable()
export class GoodsReviewService {
  constructor(private readonly prisma: PrismaService) {}

  public async create(dto: GoodsReviewCreateDto): Promise<GoodsReview> {
    return this.prisma.goodsReview.create({
      data: {
        content: dto.content,
        rating: dto.rating,
        goodsId: dto.goodsId,
        writerId: dto.writerId,
        orderItem: { connect: { id: dto.orderItemId } },
      },
    });
  }

  // public async findOne(): Promise<GoodsReview> {}
  // public async findMany(): Promise<GoodsReview[]> {}
  // public async update(): Promise<GoodsReview> {}
  // public async remove(): Promise<boolean> {}
}
