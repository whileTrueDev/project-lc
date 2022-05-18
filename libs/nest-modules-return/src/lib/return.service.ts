import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { Cache } from 'cache-manager';
import {
  CreateReturnDto,
  CreateReturnRes,
  DeleteReturnRes,
  GetReturnListDto,
  ReturnDetailRes,
  ReturnListRes,
  UpdateReturnDto,
  UpdateReturnRes,
} from '@project-lc/shared-types';
import { nanoid } from 'nanoid';
import { Prisma, Return } from '@prisma/client';

@Injectable()
export class ReturnService extends ServiceBaseWithCache {
  #RETURN_CACHE_KEY = 'return';
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  /** 반품코드 생성 */
  private createReturnCode(): string {
    return nanoid();
  }

  /** 반품요청 생성 */
  async createReturn(dto: CreateReturnDto): Promise<CreateReturnRes> {
    const { orderId, items, images, ...rest } = dto;
    const data = await this.prisma.return.create({
      data: {
        ...rest,
        returnCode: this.createReturnCode(),
        order: { connect: { id: orderId } },
        items: {
          create: items.map((item) => ({
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

    await this._clearCaches(this.#RETURN_CACHE_KEY);
    return data;
  }

  /** 반품요청 내역 조회 */
  async getReturnList(dto: GetReturnListDto): Promise<ReturnListRes> {
    let where: Prisma.ReturnWhereInput;
    if (dto.customerId) {
      where = {
        order: { customerId: dto.customerId },
      };
    }
    if (dto.sellerId) {
      where = {
        items: { some: { orderItem: { goods: { sellerId: dto.sellerId } } } },
      };
    }

    const totalCount = await this.prisma.return.count({ where });
    const data = await this.prisma.return.findMany({
      take: dto.take,
      skip: dto.skip,
      where,
      orderBy: { requestDate: 'desc' },
      include: {
        order: { select: { orderCode: true } },
        refund: true,
        items: {
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
      const { items, ...rest } = d;

      const _items = items.map((i) => ({
        id: i.id, // 반품 상품 고유번호
        amount: i.amount, // 반품 상품 개수
        status: i.status, // 반품 상품 처리상태
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

  async findUnique(where: Prisma.ReturnWhereUniqueInput): Promise<Return> {
    const data = await this.prisma.return.findUnique({
      where,
    });

    if (!data)
      throw new BadRequestException(
        `해당 반품요청 정보가 없습니다. ${JSON.stringify(where)}`,
      );
    return data;
  }

  /** 특정 반품요청 상세 조회 */
  async getReturnDetail(returnCode: string): Promise<ReturnDetailRes> {
    await this.findUnique({ returnCode });

    const data = await this.prisma.return.findUnique({
      where: { returnCode },
      include: {
        order: { select: { orderCode: true } },
        refund: true,
        items: {
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
    const { items, ...rest } = data;
    const _items = items.map((i) => ({
      id: i.id, // 반품 상품 고유번호
      amount: i.amount, // 반품 상품 개수
      status: i.status, // 반품 상품 처리상태
      goodsName: i.orderItem.goods.goods_name, // 원래 주문한 상품명
      image: i.orderItem.goods.image?.[0]?.image, // 주문 상품 이미지
      shopName: i.orderItem.goods.seller.sellerShop?.shopName, // 주문상품 판매상점명
      optionName: i.orderItemOption.name, // 주문상품옵션명
      optionValue: i.orderItemOption.value, // 주문상품옵션 값
      price: Number(i.orderItemOption.discountPrice), // 주문상품옵션 가격
      orderItemId: i.orderItem.id, // 연결된 주문상품고유번호
      orderItemOptionId: i.orderItemOption.id, // 연결된 주문상품옵션 고유번호
    }));

    return {
      ...rest,
      items: _items,
    };
  }

  /** 반품요청 상태 변경(판매자 혹은 관리자가 진행) */
  async updateReturnStatus(id: number, dto: UpdateReturnDto): Promise<UpdateReturnRes> {
    await this.findUnique({ id });

    const { refundId, ...rest } = dto;
    await this.prisma.return.update({
      where: { id },
      data: {
        ...rest,
        completeDate: dto.status && dto.status === 'complete' ? new Date() : undefined,
        refund: refundId ? { connect: { id: refundId } } : undefined,
        items: {
          updateMany: {
            where: { returnId: id },
            data: { status: dto.status },
          },
        },
      },
    });

    await this._clearCaches(this.#RETURN_CACHE_KEY);
    return true;
  }

  /** 반품요청 삭제 */
  async deleteReturn(id: number): Promise<DeleteReturnRes> {
    const data = await this.findUnique({ id });
    if (data.status !== 'requested') {
      throw new BadRequestException(`처리되기 이전에만 삭제가 가능합니다`);
    }

    await this.prisma.return.delete({
      where: { id },
    });
    await this._clearCaches(this.#RETURN_CACHE_KEY);
    return true;
  }
}
