import { Injectable } from '@nestjs/common';
import { GoodsInquiry, GoodsInquiryComment } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { GoodsInquiryCommentDto, GoodsInquiryCommentRes } from '@project-lc/shared-types';

@Injectable()
export class GoodsInquiryCommentService {
  constructor(private readonly prisma: PrismaService) {}

  /** 특정 상품문의 답변 목록 조회 */
  public async findAll(
    goodsInquiryId: GoodsInquiry['id'],
  ): Promise<GoodsInquiryCommentRes> {
    return this.prisma.goodsInquiryComment.findMany({
      where: { goodsInquiryId },
      include: {
        seller: {
          select: { id: true, avatar: true, sellerShop: { select: { shopName: true } } },
        },
        admin: { select: { id: true, email: true } },
      },
    });
  }

  /** 특정 상품문의 답변 생성 */
  public async create(
    goodsInquiryId: GoodsInquiry['id'],
    dto: GoodsInquiryCommentDto,
  ): Promise<GoodsInquiryComment> {
    const result = await this.prisma.$transaction([
      this.prisma.goodsInquiryComment.create({
        data: {
          goodsInquiryId,
          content: dto.content,
          adminId: dto.adminId,
          sellerId: dto.sellerId,
          writtenBySellerFlag: !!dto.sellerId,
        },
      }),
      this.prisma.goodsInquiry.update({
        where: { id: goodsInquiryId },
        data: { status: dto.sellerId ? 'answered' : 'adminAnswered' },
      }),
    ]);
    return result[0];
  }

  /** 특정 상품문의 답변 수정 */
  public async update(
    commentId: GoodsInquiryComment['id'],
    dto: GoodsInquiryCommentDto,
  ): Promise<GoodsInquiryComment> {
    const updated = await this.prisma.goodsInquiryComment.update({
      where: { id: commentId },
      data: {
        content: dto.content,
        adminId: dto.adminId,
        sellerId: dto.sellerId,
        writtenBySellerFlag: !!dto.sellerId,
      },
    });
    return updated;
  }

  /** 특정 상품문의 답변 삭제 */
  public async remove(commentId: GoodsInquiryComment['id']): Promise<boolean> {
    const result = await this.prisma.goodsInquiryComment.delete({
      where: { id: commentId },
    });
    const commentCount = await this.prisma.goodsInquiryComment.count({
      where: { id: result.goodsInquiryId },
    });
    if (commentCount === 0) {
      await this.prisma.goodsInquiry.update({
        where: { id: result.goodsInquiryId },
        data: { status: 'requested' },
      });
    }
    return !!result;
  }
}
