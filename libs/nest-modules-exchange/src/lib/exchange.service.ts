import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { Cache } from 'cache-manager';
import {
  CreateExchangeDto,
  CreateExchangeRes,
  ExchangeListRes,
  GetExchangeListDto,
} from '@project-lc/shared-types';
import { nanoid } from 'nanoid';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExchangeService extends ServiceBaseWithCache {
  #EXCHANGE_CACHE_KEY = 'exchange';
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  /** 교환코드 생성 */
  private createExchangeCode(): string {
    return nanoid();
  }

  /** 교환요청 생성 */
  async createExchange(dto: CreateExchangeDto): Promise<CreateExchangeRes> {
    const { orderId, exchangeItems, images, ...rest } = dto;

    const exchangeCode = this.createExchangeCode();
    const data = await this.prisma.exchange.create({
      data: {
        ...rest,
        exchangeCode,
        order: { connect: { id: orderId } },
        exchangeItems: {
          create: exchangeItems.map((item) => ({
            orderItem: { connect: { id: item.orderItemId } },
            orderItemOption: { connect: { id: item.orderItemOptionId } },
            amount: item.amount,
          })),
        },
        images: {
          create: images,
        },
      },
    });

    await this._clearCaches(this.#EXCHANGE_CACHE_KEY);
    return data;
  }

  /** 교환요청 내역 조회 */
  async getExchangeList(dto: GetExchangeListDto): Promise<ExchangeListRes> {
    let where: Prisma.ExchangeWhereInput;
    if (dto.customerId) {
      where = {
        order: { customerId: dto.customerId },
      };
    }
    if (dto.sellerId) {
      where = {
        exchangeItems: { some: { orderItem: { goods: { sellerId: dto.sellerId } } } },
      };
    }
    const data = await this.prisma.exchange.findMany({
      take: dto.take,
      skip: dto.skip,
      where,
      include: {
        exchangeItems: true,
        images: true,
      },
    });
    return data;
  }
}
