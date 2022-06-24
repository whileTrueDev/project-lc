import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Return } from '@prisma/client';
import { CipherService } from '@project-lc/nest-modules-cipher';
import { PrismaService } from '@project-lc/prisma-orm';
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

@Injectable()
export class ReturnService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cipherService: CipherService,
  ) {}

  /** 반품코드 생성 */
  private createReturnCode(): string {
    return nanoid();
  }

  /** 반품요청 생성 */
  async createReturn(dto: CreateReturnDto): Promise<CreateReturnRes> {
    const { orderId, items, images, returnBankAccount, ...rest } = dto;
    const encryptedBankAccount = this.cipherService.getEncryptedText(returnBankAccount);
    const data = await this.prisma.return.create({
      data: {
        ...rest,
        returnBankAccount: encryptedBankAccount,
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
      const { items, returnBankAccount, refund, ...rest } = d;

      const decryptedBankAccount = this.cipherService.getDecryptedText(returnBankAccount);

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

      const _refund = refund
        ? {
            ...refund,
            refundAccount: this.cipherService.getDecryptedText(refund.refundAccount), // 환불계좌정보 복호화
          }
        : undefined;

      return {
        ...rest,
        items: _items,
        returnBankAccount: decryptedBankAccount,
        refund: _refund,
      };
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
    const { items, returnBankAccount, refund, ...rest } = data;

    const decryptedBankAccount = this.cipherService.getDecryptedText(returnBankAccount);

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

    const _refund = refund
      ? {
          ...refund,
          refundAccount: this.cipherService.getDecryptedText(refund.refundAccount), // 환불계좌정보 복호화
        }
      : undefined;

    return {
      ...rest,
      items: _items,
      returnBankAccount: decryptedBankAccount,
      refund: _refund,
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

    return true;
  }

  /** 반품요청 삭제 */
  async deleteReturn(id: number): Promise<DeleteReturnRes> {
    const data = await this.findUnique({ id });
    if (data.status !== 'requested') {
      throw new BadRequestException(`처리되기 이전에만 삭제가 가능합니다`);
    }

    await this.prisma.return.delete({ where: { id } });
    return true;
  }
}
