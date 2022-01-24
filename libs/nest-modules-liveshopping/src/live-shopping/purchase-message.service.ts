import { Injectable } from '@nestjs/common';
import { LiveShoppingPurchaseMessage } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class PurchaseMessageService {
  constructor(private readonly prisma: PrismaService) {}

  /** 특정 라이브 쇼핑의 현황(응원메시지 데이터) 조회 - 생성일 내림차순 조회(최신순)
   * @param liveShoppingId 라이브쇼핑 고유id
   */
  async getAllMessagesAndPrice(
    liveShoppingId: number,
  ): Promise<LiveShoppingPurchaseMessage[]> {
    return this.prisma.liveShoppingPurchaseMessage.findMany({
      where: {
        liveShoppingId,
      },
      orderBy: {
        createDate: 'desc',
      },
    });
  }
}
