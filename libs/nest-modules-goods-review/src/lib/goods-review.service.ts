import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Goods, GoodsReview, Prisma } from '@prisma/client';
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

  /** 특정 상품의 리뷰 개수 조회 */
  public async getCount(goodsId: Goods['id']): Promise<number> {
    return this.prisma.goodsReview.count({ where: { goodsId } });
  }

  /** 리뷰 수정 */
  public async update(
    id: GoodsReview['id'],
    dto: GoodsReviewUpdateDto,
  ): Promise<GoodsReview> {
    const updated = await this.prisma.goodsReview.update({
      where: { id },
      data: {
        writerId: dto.writerId,
        content: dto.content,
        goodsId: dto.goodsId,
        rating: dto.rating,
      },
    });
    if (dto.images && dto.images.length > 0) {
      await this.prisma.goodsReviewImage.deleteMany({ where: { goodsReviewId: id } });
      await this.prisma.goodsReviewImage.createMany({
        data: dto.images.map((i) => ({
          goodsReviewId: id,
          imageUrl: i.imageUrl,
        })),
      });
    }
    await this._clearCaches(this.getCacheKey(updated.id));
    return updated;
  }

  /** 리뷰 삭제 */
  public async remove(id: GoodsReview['id']): Promise<boolean> {
    try {
      const result = await this.prisma.goodsReview.delete({
        where: { id },
      });
      await this._clearCaches(this.getCacheKey(result.id));
      return !!result;
    } catch (err) {
      throw new BadRequestException(`GoodsReview ${id} not found`);
    }
  }

  private getCacheKey(id: GoodsReview['id']): string {
    return `${this.#REVIEW_CACHE_KEY}/${id}`;
  }
}
