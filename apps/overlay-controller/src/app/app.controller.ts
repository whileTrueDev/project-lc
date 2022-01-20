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
import {
  LiveShoppingService,
  LiveShoppingStateBoardMessageService,
} from '@project-lc/nest-modules-liveshopping';
import { OverlayControllerService } from '@project-lc/nest-modules-overlay-controller';
import {
  liveShoppingPurchaseMessageDto,
  OverlayControllerMainRes,
  PurchaseMessageWithLoginFlag,
} from '@project-lc/shared-types';
import { getOverlayControllerHost, getOverlayHost } from '@project-lc/utils';
@Controller()
export class AppController {
  constructor(
    private readonly overlayControllerService: OverlayControllerService,
    private readonly liveShoppingService: LiveShoppingService,
    private readonly liveShoppingStateBoardMessageService: LiveShoppingStateBoardMessageService,
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

  @Post('/live-shopping-state-board-message')
  async createLiveShoppingStateBoardMessage(
    @Body('liveShoppingId', ParseIntPipe) liveShoppingId: number,
    @Body('text') text: string,
  ): Promise<any> {
    return this.liveShoppingStateBoardMessageService.createMessage({
      liveShoppingId,
      text,
    });
  }

  @Delete('/live-shopping-state-board-message')
  async deleteLiveShoppingStateBoardMessage(
    @Body('liveShoppingId', ParseIntPipe) liveShoppingId: number,
  ): Promise<any> {
    return this.liveShoppingStateBoardMessageService.deleteMessage(liveShoppingId);
  }
}
