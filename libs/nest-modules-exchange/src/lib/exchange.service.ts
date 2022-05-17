import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Exchange, Prisma } from '@prisma/client';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateExchangeDto,
  CreateExchangeRes,
  ExchangeDeleteRes,
  ExchangeDetailRes,
  ExchangeListRes,
  ExchangeUpdateRes,
  GetExchangeListDto,
  UpdateExchangeDto,
} from '@project-lc/shared-types';
import { Cache } from 'cache-manager';
import { nanoid } from 'nanoid';

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

    const totalCount = await this.prisma.exchange.count({ where });
    const data = await this.prisma.exchange.findMany({
      take: dto.take,
      skip: dto.skip,
      where,
      orderBy: { requestDate: 'desc' },
      include: {
        order: { select: { orderCode: true } },
        export: true,
        exchangeItems: {
          include: {
            orderItem: {
              select: {
                id: true,
                goods: {
                  select: {
                    id: true,
                    goods_name: true,
                    image: true,
                    seller: { select: { sellerShop: true } },
                  },
                },
              },
            },
            orderItemOption: true,
          },
        },
        images: true,
      },
    });
    // 조회한 데이터를 필요한 형태로 처리
    const list = data.map((d) => {
      const { exchangeItems, ...rest } = d;

      const _items = exchangeItems.map((i) => ({
        id: i.id, // 교환 상품 고유번호
        amount: i.amount, // 교환 상품 개수
        status: i.status, // 교환 상품 처리상태
        goodsName: i.orderItem.goods.goods_name, // 원래 주문한 상품명
        image: i.orderItem.goods.image?.[0]?.image, // 주문 상품 이미지
        shopName: i.orderItem.goods.seller.sellerShop?.shopName, // 주문상품 판매상점명
        optionName: i.orderItemOption.name, // 주문상품옵션명
        optionValue: i.orderItemOption.value, // 주문상품옵션 값
        price: Number(i.orderItemOption.discountPrice), // 주문상품옵션 가격
        orderItemId: i.orderItem.id, // 연결된 주문상품고유번호
        orderItemOptionId: i.orderItemOption.id, // 연결된 주문상품옵션 고유번호
      }));

      return { ...rest, items: _items };
    });

    return {
      list,
      totalCount,
    };
  }

  /** 특정 교환요청 상세 조회 */
  async getExchangeDetail(exchangeCode: string): Promise<ExchangeDetailRes> {
    const data = await this.prisma.exchange.findUnique({
      where: { exchangeCode },
      include: {
        order: { select: { orderCode: true } },
        export: true,
        exchangeItems: {
          include: {
            orderItem: {
              select: {
                id: true,
                goods: {
                  select: {
                    id: true,
                    goods_name: true,
                    image: true,
                    seller: { select: { sellerShop: true } },
                  },
                },
              },
            },
            orderItemOption: true,
          },
        },
        images: true,
      },
    });

    const { exchangeItems, ...rest } = data;

    const _items = exchangeItems.map((i) => ({
      id: i.id, // 교환 상품 고유번호
      amount: i.amount, // 교환 상품 개수
      status: i.status, // 교환 상품 처리상태
      goodsName: i.orderItem.goods.goods_name, // 원래 주문한 상품명
      image: i.orderItem.goods.image?.[0]?.image, // 주문 상품 이미지
      shopName: i.orderItem.goods.seller.sellerShop?.shopName, // 주문상품 판매상점명
      optionName: i.orderItemOption.name, // 주문상품옵션명
      optionValue: i.orderItemOption.value, // 주문상품옵션 값
      price: Number(i.orderItemOption.discountPrice), // 주문상품옵션 가격
      orderItemId: i.orderItem.id, // 연결된 주문상품고유번호
      orderItemOptionId: i.orderItemOption.id, // 연결된 주문상품옵션 고유번호
    }));
    return { items: _items, ...rest };
  }

  /** 교환요청 상태 변경 */
  async updateExchangeStatus(
    id: number,
    dto: UpdateExchangeDto,
  ): Promise<ExchangeUpdateRes> {
    await this.findOneById(id);

    const { exportId, ...rest } = dto;
    await this.prisma.exchange.update({
      where: { id },
      data: {
        ...rest,
        completeDate: dto.status && dto.status === 'complete' ? new Date() : undefined,
        export: exportId ? { connect: { id: exportId } } : undefined,
      },
    });

    this._clearCaches(this.#EXCHANGE_CACHE_KEY);
    return true;
  }

  private async findOneById(id: number): Promise<Exchange> {
    const data = await this.prisma.exchange.findUnique({ where: { id } });
    if (!data)
      throw new BadRequestException(`해당 교환요청이 존재하지 않습니다. 교유번호: ${id}`);
    return data;
  }

  /** 교환요청 삭제 */
  async deleteExchange(id: number): Promise<ExchangeDeleteRes> {
    await this.findOneById(id);

    await this.prisma.exchange.delete({
      where: { id },
    });

    await this._clearCaches(this.#EXCHANGE_CACHE_KEY);
    return true;
  }
}
