import { Injectable } from '@nestjs/common';
import { GoodsReview, GoodsReviewComment } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  GoodsReviewCommentCreateDto,
  GoodsReviewCommentRes,
  GoodsReviewCommentUpdateDto,
} from '@project-lc/shared-types';

@Injectable()
export class GoodsReviewCommentService {
  constructor(private readonly prisma: PrismaService) {}

  /** 리뷰 댓글 목록 조회 */
  public async findMany(reviewId: GoodsReview['id']): Promise<GoodsReviewCommentRes> {
    return this.prisma.goodsReviewComment.findMany({
      where: { reviewId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            nickname: true,
            gender: true,
          },
        },
        seller: {
          select: {
            avatar: true,
            id: true,
            sellerShop: { select: { shopName: true } },
          },
        },
      },
    });
  }

  /** 리뷰 댓글 생성 */
  public async create(
    reviewId: GoodsReview['id'],
    dto: GoodsReviewCommentCreateDto,
  ): Promise<GoodsReviewComment> {
    return this.prisma.goodsReviewComment.create({
      data: {
        reviewId,
        content: dto.content,
        customerId: dto.customerId,
        sellerId: dto.sellerId,
        writtenBySellerFlag: !!dto.sellerId,
      },
    });
  }

  /** 리뷰 댓글 수정 */
  public async update(
    reviewCommentId: GoodsReviewComment['id'],
    dto: GoodsReviewCommentUpdateDto,
  ): Promise<GoodsReviewComment> {
    const updated = await this.prisma.goodsReviewComment.update({
      where: { id: reviewCommentId },
      data: {
        content: dto.content,
        customerId: dto.customerId,
        sellerId: dto.sellerId,
        reviewId: dto.reviewId,
      },
    });
    return updated;
  }

  /** 리뷰 댓글 삭제 */
  public async remove(reviewCommentId: GoodsReviewComment['id']): Promise<boolean> {
    const result = await this.prisma.goodsReviewComment.delete({
      where: { id: reviewCommentId },
    });
    return !!result;
  }
}
