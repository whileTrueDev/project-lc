import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { GoodsInquiry, GoodsInquiryComment } from '@prisma/client';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { GoodsInquiryCommentDto, GoodsInquiryCommentRes } from '@project-lc/shared-types';
import { Cache } from 'cache-manager';

@Injectable()
export class GoodsInquiryCommentService extends ServiceBaseWithCache {
  #GOODS_INQUIRY_COMMENT_KEY = 'goods-inquiry';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

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
    await this._clearCaches(this.getCacheKey(goodsInquiryId));
    return this.prisma.goodsInquiryComment.create({
      data: {
        goodsInquiryId,
        content: dto.content,
        adminId: dto.adminId,
        sellerId: dto.sellerId,
        writtenBySellerFlag: !!dto.sellerId,
      },
    });
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
    await this._clearCaches(this.getCacheKey(updated.goodsInquiryId));
    return updated;
  }

  /** 특정 상품문의 답변 삭제 */
  public async remove(commentId: GoodsInquiryComment['id']): Promise<boolean> {
    const result = await this.prisma.goodsInquiryComment.delete({
      where: { id: commentId },
    });
    await this._clearCaches(this.getCacheKey(result.goodsInquiryId));
    return !!result;
  }

  private getCacheKey(inquiryId: GoodsInquiry['id']): string {
    return `${this.#GOODS_INQUIRY_COMMENT_KEY}/${inquiryId}`;
  }
}
