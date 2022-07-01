import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Render,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import {
  LiveShoppingService,
  PurchaseMessageService,
} from '@project-lc/nest-modules-liveshopping';
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
import { JwtAuthGuard, AdminGuard } from '@project-lc/nest-modules-authguard';
import { ViewAuthFilter } from './forbidden.exception';

@Controller()
export class AppController {
  constructor(
    private readonly overlayControllerService: OverlayControllerService,
    private readonly liveShoppingService: LiveShoppingService,
    private readonly purchaseMessageService: PurchaseMessageService,
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
}
