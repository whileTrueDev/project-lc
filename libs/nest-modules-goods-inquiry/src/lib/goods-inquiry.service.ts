import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Goods, GoodsInquiry, Prisma } from '@prisma/client';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  FindGoodsInquiryItem,
  FindGoodsInquiryRes,
  GoodsInquiryCreateDto,
  GoodsInquiryUpdateDto,
  PaginatedGoodsInquiryRes,
} from '@project-lc/shared-types';
import { Cache } from 'cache-manager';

@Injectable()
export class GoodsInquiryService extends ServiceBaseWithCache {
  #GOODS_INQUIRY_CACHE_KEY = 'goods-inquiry';
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  private readonly findParam = {
    include: {
      writer: {
        select: { id: true, name: true, nickname: true, email: true },
      },
    },
  };

  /** 상품문의 생성 */
  public async create(dto: GoodsInquiryCreateDto): Promise<GoodsInquiry> {
    await this._clearCaches(this.#GOODS_INQUIRY_CACHE_KEY);
    return this.prisma.goodsInquiry.create({
      data: {
        content: dto.content,
        goodsId: dto.goodsId,
        writerId: dto.writerId,
      },
    });
  }

  /** 상품문의 개별 조회 */
  public async findOne(id: GoodsInquiry['id']): Promise<FindGoodsInquiryItem> {
    return this.prisma.goodsInquiry.findUnique({ where: { id }, ...this.findParam });
  }

  /** 상품문의 조회 */
  public async findMany(
    where?: Prisma.GoodsInquiryWhereInput,
    opt?: { skip?: number; take?: number },
  ): Promise<PaginatedGoodsInquiryRes> {
    const { skip = 0, take = 5 } = opt;
    const realTake = take + 1;
    const result = await this.prisma.goodsInquiry.findMany({
      where,
      skip,
      take: realTake,
      ...this.findParam,
    });

    if (result.length === realTake) {
      return {
        nextCursor: skip + take,
        goodsInquiries: result.slice(0, take),
      };
    }
    return { nextCursor: undefined, goodsInquiries: result.slice(0, take) };
  }

  /** 상품 기준 상품문의 조회 */
  public async findManyByGoods(
    idParam: Goods['id'] | Goods['id'][],
  ): Promise<FindGoodsInquiryRes> {
    if (typeof idParam === 'number')
      return this.prisma.goodsInquiry.findMany({
        where: { goodsId: idParam },
        ...this.findParam,
      });
    return this.prisma.goodsInquiry.findMany({
      where: { goodsId: { in: idParam } },
      ...this.findParam,
    });
  }

  /** 상품문의 수정 */
  public async update(
    id: GoodsInquiry['id'],
    dto: GoodsInquiryUpdateDto,
  ): Promise<GoodsInquiry> {
    const updated = await this.prisma.goodsInquiry.update({ where: { id }, data: dto });
    await this._clearCaches(this.getCacheKey(updated.id));
    return updated;
  }

  /** 상품문의 삭제 */
  public async remove(id: GoodsInquiry['id']): Promise<boolean> {
    const result = await this.prisma.goodsInquiry.delete({ where: { id } });
    await this._clearCaches(this.getCacheKey(result.id));
    return !!result;
  }

  private getCacheKey(id: GoodsInquiry['id']): string {
    return `${this.#GOODS_INQUIRY_CACHE_KEY}/${id}`;
  }
}
