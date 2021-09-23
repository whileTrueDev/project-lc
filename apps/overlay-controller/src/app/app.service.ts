import { Injectable } from '@nestjs/common';
import { OverlayControllerService } from '@project-lc/nest-modules';
import { PurchaseMessageWithLoginFlag } from '@project-lc/shared-types';

@Injectable()
export class AppService {
  constructor(private overlayControllerService: OverlayControllerService) {}

  async getCreatorUrlAndNickname() {
    const creatorUrlAndNickname = await this.overlayControllerService.getCreatorUrls();
    return creatorUrlAndNickname;
  }

  async uploadPurchase(data: PurchaseMessageWithLoginFlag) {
    await this.overlayControllerService.uploadPurchase(data);
  }
}
