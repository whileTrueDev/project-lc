import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Return } from '@prisma/client';
import { CipherService } from '@project-lc/nest-modules-cipher';
import { OrderService } from '@project-lc/nest-modules-order';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  AdminReturnListDto,
  AdminReturnRes,
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
    private readonly orderService: OrderService,
  ) {}

  /** 반품코드 생성 */
  private createReturnCode(): string {
    return nanoid();
  }

  /** 반품요청 생성 */
  async createReturn(dto: CreateReturnDto): Promise<CreateReturnRes> {
    const { orderId, items, images, refundAccount, ...rest } = dto;
    const encryptedBankAccount = this.cipherService.getEncryptedText(refundAccount);
    const data = await this.prisma.return.create({
      data: {
        ...rest,
        refundAccount: encryptedBankAccount,
        returnCode: this.createReturnCode(),
        order: { connect: { id: orderId } },
        items: {
          create: items.map((item) => ({
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
      const { items, refundAccount, refund, ...rest } = d;

      const decryptedBankAccount = this.cipherService.getDecryptedText(refundAccount);

      const _items = items.map((i) => ({
        id: i.id, // 반품 상품 고유번호
        quantity: i.quantity, // 반품 상품 개수
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
        refundAccount: decryptedBankAccount,
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
    const { items, refundAccount, refund, ...rest } = data;

    const decryptedBankAccount = this.cipherService.getDecryptedText(refundAccount);

    const _items = items.map((i) => ({
      id: i.id, // 반품 상품 고유번호
      quantity: i.quantity, // 반품 상품 개수
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
      refundAccount: decryptedBankAccount,
      refund: _refund,
    };
  }

  /** 반품요청 상태 변경(판매자 혹은 관리자가 진행) */
  async updateReturnStatus(id: number, dto: UpdateReturnDto): Promise<UpdateReturnRes> {
    await this.findUnique({ id });

    const { refundId, ...rest } = dto;
    const returnData = await this.prisma.return.update({
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

    // 반품요청 처리완료(승인)되면 주문 상태를 결제취소 로 업데이트
    if (dto.status === 'complete') {
      await this.updateOrderStateAfterRefundFinish({
        orderId: returnData.orderId,
        returnId: returnData.id,
      });
    }

    return true;
  }

  /** 주문의 상태를 결제취소 로 변경(반품요청 처리완료(승인)되었을 때 사용)
   */
  private async updateOrderStateAfterRefundFinish({
    orderId,
    returnId,
  }: {
    /** 환불요청한 원주문 고유번호 */
    orderId: number;
    /** 처리된 환불요청 고유번호 */
    returnId: number;
  }): Promise<void> {
    // 변경될 상태 : "결제취소" (반품요청시 이미 결제가 완료된 상태이므로 결제취소로 변경함)
    const targetState = 'paymentCanceled';

    // 처리된 환불요청에 포함된 상품 고유번호들 구하기
    const compeletedReturnItems = await this.prisma.returnItem.findMany({
      where: { returnId, status: 'complete' },
      select: { orderItemOptionId: true },
    });

    const targetOptionIds = compeletedReturnItems.map((ri) => ri.orderItemOptionId);

    // 먼저 환불처리된 주문상품옵션들 상태 '결제취소'로 업데이트
    await this.prisma.orderItemOption.updateMany({
      where: { id: { in: targetOptionIds } },
      data: { step: targetState },
    });
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

  /** 관리자 환불처리 위해 승인된 반품요청 & 주문 & 결제정보 조회 */
  async getAdminReturnList(dto: AdminReturnListDto): Promise<AdminReturnRes> {
    const where: Prisma.ReturnWhereInput = {};
    // 환불처리 요청기간 필터 설정
    if (dto.searchDateType === 'requestDate') {
      where.requestDate = {
        gte: dto.searchStartDate ? new Date(dto.searchStartDate) : undefined,
        lt: dto.searchEndDate ? new Date(dto.searchEndDate) : undefined,
      };
    }

    const data = await this.prisma.return.findMany({
      where,
      orderBy: { requestDate: 'asc' }, // 요청일 오름차순(오래된 요청이 앞쪽에 표시)
      include: {
        order: {
          select: {
            id: true,
            orderCode: true,
            payment: true,
            orderPrice: true, // 주문상품옵션 할인가 총합
            paymentPrice: true, // 실 결제금액 = 주문상품옵션 할인가 총합 + 총 배송비 - 쿠폰할인 - 마일리지할인
            ordererName: true,
            customerCouponLogs: {
              include: { customerCoupon: { include: { coupon: true } } },
            },
            mileageLogs: true,
            shippings: true,
          },
        },
        items: {
          include: {
            orderItem: {
              select: {
                id: true,
                goods: { select: { seller: { select: { sellerShop: true } } } },
                orderShippingId: true,
              },
            },
            orderItemOption: true,
          },
        },
        images: true,
        refund: true,
      },
    });

    return data.map((d) => {
      const { refundAccount } = d;

      return Object.assign(d, {
        refundAccount: this.cipherService.getDecryptedText(refundAccount),
      });
    });
  }
}
