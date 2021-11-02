import { Controller, Get, Render, Post, Body } from '@nestjs/common';
import {
  OverlayControllerMainRes,
  PurchaseMessageWithLoginFlag,
} from '@project-lc/shared-types';
import { ConfigService } from '@nestjs/config';
import { OverlayControllerService } from '@project-lc/nest-modules';

@Controller()
export class AppController {
  constructor(
    private readonly overlayControllerService: OverlayControllerService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @Render('index')
  async renterTest(): Promise<OverlayControllerMainRes> {
    const HOST = this.configService.get('OVERLAY_HOST_NAME');

    const userIdAndUrlAndNicknames = await this.overlayControllerService.getCreatorUrls();
    return { userIdAndUrlAndNicknames, HOST };
  }

  @Post('/purchase-message')
  async uploadMessage(@Body() data: PurchaseMessageWithLoginFlag): Promise<boolean> {
    const upload = await this.overlayControllerService.uploadPurchase(data);
    return upload;
  }
}
