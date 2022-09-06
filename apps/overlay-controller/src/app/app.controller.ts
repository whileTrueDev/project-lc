import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Render,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { LiveShoppingMessageSetting, OverlayTheme } from '@prisma/client';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  LiveShoppingService,
  PurchaseMessageService,
} from '@project-lc/nest-modules-liveshopping';
import {
  OverlayControllerService,
  OverlayThemeService,
} from '@project-lc/nest-modules-overlay-controller';
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
import { ViewAuthFilter } from './forbidden.exception';

@Controller()
export class AppController {
  constructor(
    private readonly overlayControllerService: OverlayControllerService,
    private readonly liveShoppingService: LiveShoppingService,
    private readonly purchaseMessageService: PurchaseMessageService,
    private readonly themeService: OverlayThemeService,
  ) {}

  @Get('health-check')
  healthCheck(): string {
    return 'Alive';
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseFilters(ViewAuthFilter)
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

  @Get('/login')
  @Render('login')
  async loginPage(): Promise<{ message: string }> {
    return { message: 'login' };
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/purchase-message')
  async getMessage(
    @Query('liveShoppingId') liveShoppingId: number,
  ): Promise<liveShoppingPurchaseMessageDto[]> {
    return this.purchaseMessageService.getAllMessagesAndPrice(Number(liveShoppingId));
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('/purchase-message')
  async uploadMessage(@Body() data: PurchaseMessageWithLoginFlag): Promise<boolean> {
    const upload = await this.overlayControllerService.uploadPurchase(data);
    return upload;
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('/purchase-message')
  async deleteMessage(
    @Body('messageId', ParseIntPipe) messageId: number,
  ): Promise<boolean> {
    return this.overlayControllerService.deletePurchaseMessage(messageId);
  }

  @Get('message-setting')
  async getMessageSetting(
    @Query('liveShoppingId', ParseIntPipe) liveShoppingId: number,
  ): Promise<LiveShoppingMessageSetting> {
    return this.liveShoppingService.findLiveShoppingMsgSetting(liveShoppingId);
  }

  @Get('overlay-themes')
  async getOverlayThemes(): Promise<OverlayTheme[]> {
    return this.themeService.getList();
  }
}
