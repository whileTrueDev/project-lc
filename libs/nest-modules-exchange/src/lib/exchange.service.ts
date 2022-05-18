import { BadRequestException, Injectable } from '@nestjs/common';
import { Exchange, Prisma } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateExchangeDto,
  CreateExchangeRes,
  ExchangeDeleteRes,
  ExchangeListRes,
  ExchangeUpdateRes,
  GetExchangeListDto,
  ReturnDetailRes,
  UpdateExchangeDto,
} from '@project-lc/shared-types';
import { nanoid } from 'nanoid';

@Injectable()
export class ExchangeService {
  #EXCHANGE_CACHE_KEY = 'exchange';
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
            amount: item.amount,
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

  /** 특정 교환요청 상세 조회 */
  async getExchangeDetail(id: number): Promise<ReturnDetailRes> {
    return this.prisma.exchange.findUnique({
      where: { id },
      include: {
        order: { select: { orderCode: true, id: true } },
        exchangeItems: true,
        images: true,
        export: true,
      },
    });
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

    return true;
  }
}
