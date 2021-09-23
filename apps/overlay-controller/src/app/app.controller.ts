import { Controller, Get, Render, Post, Body } from '@nestjs/common';
import { PurchaseMessageWithLoginFlag } from '@project-lc/shared-types';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @Render('index')
  async renterTest() {
    const HOST = this.configService.get('OVERLAY_HOST_NAME');

    const userIdAndUrlAndNicknames = await this.appService.getCreatorUrlAndNickname();
    return { userIdAndUrlAndNicknames, HOST };
  }

  @Post('/purchase-message')
  async uploadMessage(@Body() data: PurchaseMessageWithLoginFlag) {
    const upload = await this.appService.uploadPurchase(data);
    return upload;
  }
}
