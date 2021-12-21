import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { PurchaseMessageWithLoginFlag } from '@project-lc/shared-types';
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
    if (!writePurchaseMessage) throwError('Cannot upload data');
    return true;
  }
}
