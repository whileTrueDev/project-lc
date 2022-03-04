import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Render,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LiveShoppingService } from '@project-lc/nest-modules-liveshopping';
import { OverlayControllerService } from '@project-lc/nest-modules-overlay-controller';
import {
  liveShoppingPurchaseMessageDto,
  OverlayControllerMainRes,
  PurchaseMessageWithLoginFlag,
} from '@project-lc/shared-types';
import {
  getOverlayControllerHost,
  getOverlayHost,
  getRealtimeApiHost,
} from '@project-lc/utils';

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
    const OVERLAY_HOST = getOverlayHost();
    const OVERLAY_CONTROLLER_HOST = getOverlayControllerHost();
    const REALTIME_API_HOST = getRealtimeApiHost();
    const userIdAndUrlAndNicknames = await this.overlayControllerService.getCreatorUrls();
    const liveShoppings =
      await this.liveShoppingService.getLiveShoppingsForOverlayController();
    return {
      userIdAndUrlAndNicknames,
      OVERLAY_HOST,
      OVERLAY_CONTROLLER_HOST,
      liveShoppings,
      REALTIME_API_HOST,
    };
  }

  @Get('/purchase-message')
  async getMessage(
    @Query('liveShoppingId') liveShoppingId: number,
  ): Promise<liveShoppingPurchaseMessageDto[]> {
    return this.overlayControllerService.getPurchaseMessage(liveShoppingId);
  }

  @Post('/purchase-message')
  async uploadMessage(@Body() data: PurchaseMessageWithLoginFlag): Promise<boolean> {
    const upload = await this.overlayControllerService.uploadPurchase(data);
    return upload;
  }

  @Delete('/purchase-message')
  async deleteMessage(
    @Body('messageId', ParseIntPipe) messageId: number,
  ): Promise<boolean> {
    return this.overlayControllerService.deletePurchaseMessage(messageId);
  }
}
