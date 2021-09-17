import { Controller, Get, Render, Post, Body } from '@nestjs/common';
import { PurchaseMessageWithLoginFlag } from '@project-lc/shared-types';
import { OverlayControllerService } from '@project-lc/nest-modules';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly overlayControllerService: OverlayControllerService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @Render('index')
  async renterTest() {
    const HOST = this.configService.get('OVERLAY_HOST_NAME');

    const userIdAndUrlAndNicknames = await this.overlayControllerService.getCreatorUrls();
    return { userIdAndUrlAndNicknames, HOST };
  }

  @Post('/purchase-message')
  async uploadMessage(@Body() data: PurchaseMessageWithLoginFlag) {
    const upload = await this.overlayControllerService.uploadPurchase(data);
    return upload;
  }
}
