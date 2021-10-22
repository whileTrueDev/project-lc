import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { SellerOrderCancelRequestDto } from '@project-lc/shared-types';

@Injectable()
export class OrderCancelService {
  constructor(private readonly prisma: PrismaService) {}

  /** 판매자 주문취소 요청 생성 */
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

    // 해당 주문에 대해 이미 주문취소 요청을 한 경우 수정
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

  /** 판매자 주문취소 요청 상세 조회 */
  public async findOneOrderCancelRequst(): Promise<any> {
    return '판매자 주문취소 요청 조회';
  }
}
