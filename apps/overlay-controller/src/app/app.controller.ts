import { Controller, Get, Render, Post, Body } from '@nestjs/common';
import { PurchaseMessageWithLoginFlag } from '@project-lc/shared-types';
import { OverlayControllerService } from '@project-lc/nest-modules';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly overlayControllerService: OverlayControllerService,
  ) {}

  @Get()
  @Render('index')
  async renterTest() {
    const urlAndNicknames = await this.overlayControllerService.getCreatorUrls();
    return { urlAndNicknames };
  }

  @Post('/purchase-message')
  async uploadMessage(@Body() data: PurchaseMessageWithLoginFlag) {
    console.log(data);
    const upload = await this.overlayControllerService.uploadPurchase(data);
    return upload;
  }
}
