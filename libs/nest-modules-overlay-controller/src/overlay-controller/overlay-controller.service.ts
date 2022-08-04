import { Injectable } from '@nestjs/common';
import { PurchaseMessageService } from '@project-lc/nest-modules-liveshopping';

import { PrismaService } from '@project-lc/prisma-orm';
import {
  PurchaseMessageWithLoginFlag,
  liveShoppingPurchaseMessageDto,
} from '@project-lc/shared-types';
import { throwError } from 'rxjs';

@Injectable()
export class OverlayControllerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly purchaseMessageService: PurchaseMessageService,
  ) {}

  // 방송인 url 받아오기
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

  // 응원메세지 create
  async uploadPurchase(data: PurchaseMessageWithLoginFlag): Promise<boolean> {
    return this.purchaseMessageService.uploadPurchaseMessage(data);
  }

  // 응원메세지 목록 get
  async getPurchaseMessage(
    liveShoppingId: number,
  ): Promise<liveShoppingPurchaseMessageDto[]> {
    return this.purchaseMessageService.getAllMessagesAndPrice(liveShoppingId);
  }

  // 특정 응원메세지 delete
  async deletePurchaseMessage(messageId: number): Promise<boolean> {
    return this.purchaseMessageService.deletePurchaseMessage(messageId);
  }
}
