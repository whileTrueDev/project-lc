import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LiveShoppingStateBoardMessage } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  PurchaseMessageWithLoginFlag,
  liveShoppingPurchaseMessageDto,
} from '@project-lc/shared-types';
import { throwError } from 'rxjs';

@Injectable()
export class OverlayControllerService {
  constructor(private readonly prisma: PrismaService) {}

  async getCreatorUrls(): Promise<
    { email: string; userNickname: string; overlayUrl: string }[]
  > {
    const urlAndNickname = await this.prisma.broadcaster.findMany({
      select: {
        email: true,
        userNickname: true,
        overlayUrl: true,
      },
    });
    if (!urlAndNickname) throwError('Cannot Get Data From Db');
    return urlAndNickname;
  }

  async uploadPurchase(data: PurchaseMessageWithLoginFlag): Promise<boolean> {
    const { nickname } = data;
    const text = data.message;
    const price = data.purchaseNum;
    const { loginFlag } = data;
    const broadcasterEmail = data.email;
    const { phoneCallEventFlag } = data;
    const { giftFlag } = data;
    const { liveShoppingId } = data;
    const writePurchaseMessage = await this.prisma.liveShoppingPurchaseMessage.create({
      data: {
        nickname,
        text,
        price,
        loginFlag,
        phoneCallEventFlag,
        giftFlag,
        liveShopping: { connect: { id: Number(liveShoppingId) } },
        broadcaster: { connect: { email: broadcasterEmail } },
      },
    });
    if (!writePurchaseMessage) throwError(() => 'Cannot upload data');
    return true;
  }

  async getPurchaseMessage(
    liveShoppingId: number,
  ): Promise<liveShoppingPurchaseMessageDto[]> {
    return this.prisma.liveShoppingPurchaseMessage.findMany({
      where: {
        liveShoppingId: Number(liveShoppingId),
      },
      select: {
        id: true,
        nickname: true,
        text: true,
        price: true,
        createDate: true,
      },
    });
  }

  async deletePurchaseMessage(messageId: number): Promise<boolean> {
    const deletePurchaseMessage = await this.prisma.liveShoppingPurchaseMessage.delete({
      where: { id: Number(messageId) },
    });
    if (!deletePurchaseMessage) throwError(() => 'Cannot delete data');
    return true;
  }

  /** 라이브쇼핑 현황판 관리자메시지 데이터 찾기
   * @param liveShoppingId 라이브쇼핑id(number)
   * @returns liveShoppingId 로 보낸 관리자 메시지가 존재하는 경우 LiveShoppingStateBoardMessage 반환
   *          해당 라이브쇼핑에 보낸 메시지가 존재하지 않는 경우 null
   */
  private async findOneLiveShoppingStateBoardMessage(
    liveShoppingId: number,
  ): Promise<LiveShoppingStateBoardMessage | null> {
    const data = await this.prisma.liveShoppingStateBoardMessage.findFirst({
      where: { liveShoppingId },
    });

    if (!data) return null;

    return data;
  }

  /** 라이브쇼핑 현황판 관리자메시지 생성
   * liveShoppingId에 보낸 관리자메시지가 이미 존재하는 경우, text 내용만 변경
   * @param liveShoppingId 라이브쇼핑id(number)
   * @param text 메시지 내용
   * @return 생성 성공시 true 반환
   */
  async createLiveShoppingStateBoardMessage({
    liveShoppingId,
    text,
  }: {
    liveShoppingId: number;
    text: string;
  }): Promise<boolean> {
    try {
      const data = await this.findOneLiveShoppingStateBoardMessage(liveShoppingId);

      if (!data) {
        await this.prisma.liveShoppingStateBoardMessage.create({
          data: {
            liveShoppingId,
            text,
          },
        });

        return true;
      }

      await this.prisma.liveShoppingStateBoardMessage.update({
        where: {
          id: data.id,
        },
        data: {
          text,
        },
      });
      return true;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  /** 라이브쇼핑 현황판 관리자메시지 삭제
   * 해당 liveShoppingId로 생성된 메시지가 없는경우 400에러
   * @param liveShoppingId 라이브쇼핑id(number)
   * @return 삭제 성공시 true 반환
   */
  async deleteLiveShoppingStateBoardMessage(liveShoppingId: number): Promise<boolean> {
    const data = await this.findOneLiveShoppingStateBoardMessage(liveShoppingId);

    if (!data) {
      throw new BadRequestException(`no message for liveShoppingId ${liveShoppingId}`);
    }

    await this.prisma.liveShoppingStateBoardMessage.delete({
      where: { id: data.id },
    });
    return true;
  }
}
