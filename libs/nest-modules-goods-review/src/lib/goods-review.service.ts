import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { GoodsReview, Prisma } from '@prisma/client';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  DefaultPaginationDto,
  GoodsReviewCreateDto,
  GoodsReviewItem,
  GoodsReviewRes,
  GoodsReviewUpdateDto,
} from '@project-lc/shared-types';
import { Cache } from 'cache-manager';

@Injectable()
export class GoodsReviewService extends ServiceBaseWithCache {
  #REVIEW_CACHE_KEY = 'goods-review';
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  /** 리뷰 생성 */
  public async create(dto: GoodsReviewCreateDto): Promise<GoodsReview> {
    await this._clearCaches(this.#REVIEW_CACHE_KEY);
    return this.prisma.goodsReview.create({
      data: {
        content: dto.content,
        rating: dto.rating,
        goodsId: dto.goodsId,
        writerId: dto.writerId,
        orderItem: { connect: { id: dto.orderItemId } },
        images: { createMany: { data: dto.images } },
      },
    });
  }

  /** 특정 리뷰 조회 */
  public async findOne(id: GoodsReview['id']): Promise<GoodsReviewItem> {
    return this.prisma.goodsReview.findUnique({
      where: { id },
      include: {
        images: true,
        writer: { select: { nickname: true, name: true, id: true, gender: true } },
      },
    });
  }

  /** 리뷰 목록 조회 */
  public async findMany(
    where?: Prisma.GoodsReviewWhereInput,
    paginationOpts?: DefaultPaginationDto,
  ): Promise<GoodsReviewRes> {
    const { skip = 0, take = 5 } = paginationOpts;
    const realTake = take + 1;
    const result = await this.prisma.goodsReview.findMany({
      where,
      skip,
      take: realTake,
      include: {
        images: true,
        writer: { select: { nickname: true, name: true, id: true, gender: true } },
      },
    });

    const nextCursor = skip + take; // 다음 조회시 skip 값으로 사용
    if (result.length === realTake) {
      return { nextCursor, reviews: result.slice(0, take) };
    }
    return { nextCursor: undefined, reviews: result };
  }

  /** 리뷰 수정 */
  public async update(
    id: GoodsReview['id'],
    dto: GoodsReviewUpdateDto,
  ): Promise<GoodsReview> {
    await this._clearCaches(this.#REVIEW_CACHE_KEY);
    return this.prisma.goodsReview.update({
      where: { id },
      data: {
        writerId: dto.writerId,
        content: dto.content,
        goodsId: dto.goodsId,
        rating: dto.rating,
        images: {
          updateMany: {
            where: { goodsReviewId: id },
            data: dto.images,
          },
        },
      },
    });
  }

  /** 리뷰 삭제 */
  public async remove(id: GoodsReview['id']): Promise<boolean> {
    await this._clearCaches(this.#REVIEW_CACHE_KEY);
    const result = await this.prisma.goodsReview.delete({
      where: { id },
    });
    return !!result;
  }
}
