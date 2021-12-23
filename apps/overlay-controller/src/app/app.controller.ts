import {
  Controller,
  Get,
  Render,
  Post,
  Body,
  Query,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  OverlayControllerMainRes,
  PurchaseMessageWithLoginFlag,
  liveShoppingPurchaseMessageDto,
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
    const OVERLAY_HOST = getOverlayHost();
    const OVERLAY_CONTROLLER_HOST = getOverlayControllerHost();
    const userIdAndUrlAndNicknames = await this.overlayControllerService.getCreatorUrls();
    const liveShoppings =
      await this.liveShoppingService.getLiveShoppingsForOverlayController();
    return {
      userIdAndUrlAndNicknames,
      OVERLAY_HOST,
      OVERLAY_CONTROLLER_HOST,
      liveShoppings,
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
