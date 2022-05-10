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
import { GoodsReviewImageService } from './goods-review-image.service';

@Injectable()
export class GoodsReviewService extends ServiceBaseWithCache {
  #REVIEW_CACHE_KEY = 'goods-review';
  #REVIEW_NEEDED_ORDER_ITEM_CACHE_KEY = 'order-item/review-needed';
  #ORDER_LIST_CACHE_KEY = 'order/list';
  constructor(
    private readonly prisma: PrismaService,
    private readonly goodsReviewImageService: GoodsReviewImageService,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  /** 리뷰 생성 */
  public async create(dto: GoodsReviewCreateDto): Promise<GoodsReview> {
    const alreadyCreated = await this.prisma.goodsReview.count({
      where: { orderItem: { some: { id: dto.orderItemId } } },
    });
    if (alreadyCreated > 0) return null;

    await this._clearCaches(this.#REVIEW_CACHE_KEY);
    await this._clearCaches(this.#REVIEW_NEEDED_ORDER_ITEM_CACHE_KEY); // 리뷰 작성가능한 orderItem 목록 초기화 위해
    await this._clearCaches(this.#ORDER_LIST_CACHE_KEY); // 내 주문목록 캐시 초기화
    return this.prisma.goodsReview.create({
      data: {
        content: dto.content,
        rating: dto.rating,
        goodsId: dto.goodsId,
        writerId: dto.writerId,
        orderItem: { connect: { id: dto.orderItemId } },
        images: dto.images ? { createMany: { data: dto.images } } : undefined,
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
      orderBy: { createDate: 'desc' },
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
      await this.updateImages(id, dto.images);
    }
    await this._clearCaches(this.#REVIEW_CACHE_KEY);
    return updated;
  }

  /** 이미지 수정 (삭제할 것 삭제, 등록할 것 등록) */
  private async updateImages(
    goodsReviewId: GoodsReview['id'],
    images: GoodsReviewUpdateDto['images'],
  ): Promise<boolean> {
    const insertedImages = await this.prisma.goodsReviewImage.findMany({
      where: { goodsReviewId },
    });
    // 새롭게 생성해야할 이미지
    const newImages = images.filter(
      (image) => !insertedImages.map(({ imageUrl }) => imageUrl).includes(image.imageUrl),
    );
    await this.prisma.goodsReviewImage.createMany({
      data: newImages.map((i) => ({
        goodsReviewId,
        imageUrl: i.imageUrl,
      })),
    });

    // 삭제해야할 이미지
    const removeImages = insertedImages.filter(
      (inserted) => !images.map(({ imageUrl }) => imageUrl).includes(inserted.imageUrl),
    );
    await this.goodsReviewImageService.removeImages(removeImages);

    return true;
  }

  /** 리뷰 삭제 */
  public async remove(id: GoodsReview['id']): Promise<boolean> {
    try {
      await this.goodsReviewImageService.removeAllImageByReviewId(id);
      const result = await this.prisma.goodsReview.delete({
        where: { id },
        include: { images: true },
      });

      await this._clearCaches(this.#REVIEW_CACHE_KEY);
      await this._clearCaches(this.#REVIEW_NEEDED_ORDER_ITEM_CACHE_KEY); // 리뷰 작성가능한 orderItem 목록 초기화 위해
      await this._clearCaches(this.#ORDER_LIST_CACHE_KEY); // 내 주문목록 캐시 초기화
      return !!result;
    } catch (err) {
      throw new BadRequestException(`GoodsReview ${id} not found`);
    }
  }
}
