import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { SellerOrderCancelRequestDto } from '@project-lc/shared-types';

@Injectable()
export class OrderCancelService {
  constructor(private readonly prisma: PrismaService) {}

  /** 판매자 결제취소 요청 생성 */
  public async createOrderCancelRequst({
    sellerEmail,
    ...dto
  }: {
    sellerEmail: string;
  } & SellerOrderCancelRequestDto): Promise<any> {
    const { orderSeq, reason, orderCancelItems } = dto;

    const existCancelRequst = await this.prisma.sellerOrderCancelRequest.findFirst({
      where: { seller: { email: sellerEmail }, orderSeq },
      include: { orderCancelItems: true },
    });

    // 해당 주문에 대해 이미 결제취소 요청을 한 경우 수정
    if (existCancelRequst) {
      const { id, orderCancelItems: existCancelRequestItems } = existCancelRequst;
      const updatedData = await this.prisma.sellerOrderCancelRequest.update({
        where: { id },
        data: {
          doneFlag: false,
          reason,
          orderCancelItems: {
            update: existCancelRequestItems.map((existItem) => {
              return {
                where: { id: existItem.id },
                data: orderCancelItems.find(
                  (item) => existItem.orderItemOptionSeq === item.orderItemOptionSeq,
                ),
              };
            }),
          },
        },
      });
      return updatedData;
    }
    const data = await this.prisma.sellerOrderCancelRequest.create({
      data: {
        seller: { connect: { email: sellerEmail } },
        doneFlag: false,
        orderSeq,
        reason,
        orderCancelItems: {
          create: orderCancelItems,
        },
      },
    });
    return data;
  }

  /** 판매자 결제취소 요청 상세 조회 */
  public async findOneOrderCancelRequst({
    orderSeq,
    sellerEmail,
  }: {
    sellerEmail: string;
    orderSeq: string;
  }): Promise<any> {
    const data = await this.prisma.sellerOrderCancelRequest.findFirst({
      where: { seller: { email: sellerEmail }, orderSeq, doneFlag: false },
    });
    return data;
  }

  /** 결제취소 요청 목록 조회 */
  public async getAllOrderCancelRequests(): Promise<any> {
    const data = await this.prisma.sellerOrderCancelRequest.findMany({
      where: { doneFlag: false }, // 처리되지 않은 요청만 조회
      select: {
        id: true,
        seller: { select: { email: true, id: true } },
        reason: true,
        orderSeq: true,
        createDate: true,
      },
      orderBy: { createDate: 'asc' },
    });
    return data;
  }

  /** 특정 주문에 대한 결제취소 요청 조회 */
  public async getOneOrderCancelRequest(orderId: string): Promise<any> {
    const data = await this.prisma.sellerOrderCancelRequest.findFirst({
      where: { orderSeq: orderId },
      select: {
        id: true,
        seller: { select: { email: true, id: true, sellerShop: true } },
        reason: true,
        orderSeq: true,
        createDate: true,
        orderCancelItems: true,
        doneFlag: true,
      },
    });
    return data;
  }

  /** 특정 주문에 대한 결제취소 요청 상태 변경 */
  public async setOrderCancelRequestDone(
    requestId: number,
    doneFlag: boolean,
  ): Promise<any> {
    const data = await this.prisma.sellerOrderCancelRequest.update({
      where: { id: requestId },
      data: { doneFlag },
    });

    console.log('updated', data);
    return data;
  }
}
