import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Goods, GoodsInquiry, Prisma } from '@prisma/client';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  FindGoodsInquiryItem,
  FindGoodsInquiryRes,
  GoodsInquiryCreateDto,
  GoodsInquiryUpdateDto,
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

  public async create(dto: GoodsInquiryCreateDto): Promise<GoodsInquiry> {
    this._clearCaches(this.#GOODS_INQUIRY_CACHE_KEY);
    return this.prisma.goodsInquiry.create({ data: dto });
  }

  public async findOne(id: GoodsInquiry['id']): Promise<FindGoodsInquiryItem> {
    return this.prisma.goodsInquiry.findUnique({ where: { id }, ...this.findParam });
  }

  public async findMany(
    where?: Prisma.GoodsInquiryWhereInput,
    opt?: { skip?: number; take?: number },
  ): Promise<FindGoodsInquiryRes> {
    return this.prisma.goodsInquiry.findMany({
      where,
      ...opt,
      ...this.findParam,
    });
  }

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

  public async update(
    id: GoodsInquiry['id'],
    dto: GoodsInquiryUpdateDto,
  ): Promise<GoodsInquiry> {
    return this.prisma.goodsInquiry.update({ where: { id }, data: dto });
  }

  public async remove(id: GoodsInquiry['id']): Promise<boolean> {
    const result = await this.prisma.goodsInquiry.delete({ where: { id } });
    return !!result;
  }
}
