import { Injectable } from '@nestjs/common';
import { SellerOrderCancelRequest, SellerOrderCancelRequestStatus } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  OrderCancelRequestDetailRes,
  OrderCancelRequestList,
  SellerOrderCancelRequestDto,
} from '@project-lc/shared-types';

@Injectable()
export class OrderCancelService {
  constructor(private readonly prisma: PrismaService) {}

  /** 판매자 결제취소 요청 생성 */
  public async createOrderCancelRequst({
    sellerEmail,
    ...dto
  }: {
    sellerEmail: string;
  } & SellerOrderCancelRequestDto): Promise<SellerOrderCancelRequest> {
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
          status: SellerOrderCancelRequestStatus.waiting,
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
        status: SellerOrderCancelRequestStatus.waiting,
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
  }): Promise<SellerOrderCancelRequest> {
    const data = await this.prisma.sellerOrderCancelRequest.findFirst({
      where: {
        seller: { email: sellerEmail },
        orderSeq,
        status: SellerOrderCancelRequestStatus.waiting,
      },
    });
    return data;
  }

  /** 결제취소 요청 목록 조회 */
  public async getAllOrderCancelRequests(): Promise<OrderCancelRequestList> {
    const data = await this.prisma.sellerOrderCancelRequest.findMany({
      where: { status: SellerOrderCancelRequestStatus.waiting }, // 처리되지 않은 요청만 조회
      select: {
        id: true,
        seller: { select: { email: true, id: true } },
        reason: true,
        orderSeq: true,
        createDate: true,
        status: true,
      },
      orderBy: { createDate: 'asc' },
    });
    return data;
  }

  /** 특정 주문에 대한 결제취소 요청 조회 */
  public async getOneOrderCancelRequest(
    orderId: string,
  ): Promise<OrderCancelRequestDetailRes> {
    const data = await this.prisma.sellerOrderCancelRequest.findFirst({
      where: { orderSeq: orderId },
      select: {
        id: true,
        seller: { select: { email: true, id: true, sellerShop: true } },
        reason: true,
        orderSeq: true,
        createDate: true,
        orderCancelItems: true,
        status: true,
      },
    });
    return data;
  }

  /** 특정 주문에 대한 결제취소 요청 상태 변경 */
  public async setOrderCancelRequestDone(requestId: number): Promise<boolean> {
    await this.prisma.sellerOrderCancelRequest.update({
      where: { id: requestId },
      data: { status: SellerOrderCancelRequestStatus.confirmed },
    });

    return true;
  }
}
