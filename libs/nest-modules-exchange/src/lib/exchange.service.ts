import { BadRequestException, Injectable } from '@nestjs/common';
import { Exchange, Prisma } from '@prisma/client';

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
import { nanoid } from 'nanoid';

@Injectable()
export class ExchangeService {
  constructor(private readonly prisma: PrismaService) {}

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
            quantity: item.quantity,
          })),
        },
        images: {
          create: images,
        },
      },
    });

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
    // 조회한 데이터를 필요한 형태(응답타입에 맞는 형태)로 처리
    const list = data.map((d) => {
      const { exchangeItems, ...rest } = d;

      const _items = exchangeItems.map((i) => ({
        id: i.id, // 교환 상품 고유번호
        quantity: i.quantity, // 교환 상품 개수
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
    await this.findUnique({ exchangeCode });

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
      quantity: i.quantity, // 교환 상품 개수
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
    await this.findUnique({ id });

    const { exportId, ...rest } = dto;
    await this.prisma.exchange.update({
      where: { id },
      data: {
        ...rest,
        completeDate: dto.status && dto.status === 'complete' ? new Date() : undefined,
        export: exportId ? { connect: { id: exportId } } : undefined,
        exchangeItems: {
          updateMany: {
            where: { exchangeId: id },
            data: { status: dto.status },
          },
        },
      },
    });

    return true;
  }

  private async findUnique(where: Prisma.ExchangeWhereUniqueInput): Promise<Exchange> {
    const data = await this.prisma.exchange.findUnique({ where });
    if (!data)
      throw new BadRequestException(
        `해당 교환요청이 존재하지 않습니다.  ${JSON.stringify(where)}`,
      );
    return data;
  }

  /** 교환요청 삭제 */
  async deleteExchange(id: number): Promise<ExchangeDeleteRes> {
    await this.findUnique({ id });

    await this.prisma.exchange.delete({
      where: { id },
    });

    return true;
  }
}
