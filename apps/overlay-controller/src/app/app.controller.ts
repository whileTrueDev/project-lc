import { Controller, Get, Render, Post, Body } from '@nestjs/common';
import {
  OverlayControllerMainRes,
  PurchaseMessageWithLoginFlag,
} from '@project-lc/shared-types';
import { ConfigService } from '@nestjs/config';
import { OverlayControllerService, LiveShoppingService } from '@project-lc/nest-modules';
import { getOverlayControllerHost, getOverlayHost } from '@project-lc/utils';
@Controller()
export class AppController {
  constructor(
    private readonly overlayControllerService: OverlayControllerService,
    private readonly liveShoppingService: LiveShoppingService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @Render('index')
  async renterTest(): Promise<OverlayControllerMainRes> {
    const SOCKET_HOST = getOverlayHost();
    const HOST = getOverlayControllerHost();
    const userIdAndUrlAndNicknames = await this.overlayControllerService.getCreatorUrls();
    const liveShoppings =
      await this.liveShoppingService.getLiveShoppingsForOverlayController();
    return { userIdAndUrlAndNicknames, SOCKET_HOST, HOST, liveShoppings };
  }

  @Post('/purchase-message')
  async uploadMessage(@Body() data: PurchaseMessageWithLoginFlag): Promise<boolean> {
    const upload = await this.overlayControllerService.uploadPurchase(data);
    return upload;
  }
}
