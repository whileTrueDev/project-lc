import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LiveShoppingPurchaseMessage } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { PurchaseMessageWithLoginFlag } from '@project-lc/shared-types';

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

  /** 구매 메시지 등록 */
  async uploadPurchaseMessage(data: PurchaseMessageWithLoginFlag): Promise<boolean> {
    const {
      giftFlag,
      liveShoppingId,
      phoneCallEventFlag,
      nickname,
      loginFlag,
      message: text,
      purchaseNum: price,
      email: broadcasterEmail,
    } = data;

    const writePurchaseMessage = await this.prisma.liveShoppingPurchaseMessage.create({
      data: {
        nickname,
        text,
        price,
        loginFlag,
        phoneCallEventFlag,
        giftFlag,
        liveShopping: liveShoppingId
          ? { connect: { id: Number(liveShoppingId) } }
          : undefined,
        broadcaster: broadcasterEmail
          ? { connect: { email: broadcasterEmail } }
          : undefined,
      },
    });
    if (!writePurchaseMessage) {
      throw new InternalServerErrorException('Cannot upload data');
    }
    return true;
  }

  /** 특정 구매 메시지 삭제 */
  public async deletePurchaseMessage(id: number): Promise<boolean> {
    const deletePurchaseMessage = await this.prisma.liveShoppingPurchaseMessage.delete({
      where: { id: Number(id) },
    });
    if (!deletePurchaseMessage) {
      throw new InternalServerErrorException('Cannot upload data');
    }
    return true;
  }
}
