import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SellerInfo, UserPayload } from '@project-lc/nest-core';
import { GoodsService } from '@project-lc/nest-modules-goods';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  ApprovedGoodsNameAndId,
  LiveShoppingParamsDto,
  LiveShoppingRegistDTO,
} from '@project-lc/shared-types';
import {
  LiveShopping,
  LiveShoppingPurchaseMessage,
  LiveShoppingStateBoardAlert,
  LiveShoppingStateBoardMessage,
} from '@prisma/client';
import { LiveShoppingService } from './live-shopping.service';
import { PurchaseMessageService } from './purchase-message.service';
import { LiveShoppingStateBoardService } from './live-shopping-state-board.service';

@UseGuards(JwtAuthGuard)
@Controller('live-shoppings')
export class LiveShoppingController {
  constructor(
    private readonly goodsService: GoodsService,
    private readonly liveShoppingService: LiveShoppingService,
    private readonly purchaseMessageService: PurchaseMessageService,
    private readonly liveShoppingStateBoardService: LiveShoppingStateBoardService,
  ) {}

  @Get()
  getLiveShoppings(
    @SellerInfo() seller: UserPayload,
    @Query(ValidationPipe) dto?: LiveShoppingParamsDto,
  ): Promise<LiveShopping[]> {
    return this.liveShoppingService.getRegisteredLiveShoppings(seller.sub, dto);
  }

  /** 라이브쇼핑 등록 */
  @Post()
  createLiveShopping(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: LiveShoppingRegistDTO,
  ): Promise<{ liveShoppingId: number }> {
    return this.liveShoppingService.createLiveShopping(seller.sub, dto);
  }

  @Delete()
  deleteLiveShopping(
    @Body(ValidationPipe) liveShoppingId: { liveShoppingId: number },
  ): Promise<boolean> {
    return this.liveShoppingService.deleteLiveShopping(liveShoppingId);
  }

  @Get('/confirmed-goods')
  async getApprovedGoodsList(
    @Query('email') email: string,
  ): Promise<ApprovedGoodsNameAndId[]> {
    const goodsList = await this.goodsService.findMyGoodsNames(email);
    return goodsList;
  }

  @Get('/broadcaster')
  getBroadcasterLiveShoppings(
    @Query('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<LiveShopping[]> {
    return this.liveShoppingService.getBroadcasterRegisteredLiveShoppings(broadcasterId);
  }

  /** 특정 라이브 쇼핑에 대한 응원메시지 목록 데이터 조회 */
  @Get('/current-state-purchase-messages')
  getLiveShoppingCurrentPurchaseMessagesAndPrice(
    @Query('liveShoppingId', ParseIntPipe) liveShoppingId: number,
  ): Promise<LiveShoppingPurchaseMessage[]> {
    return this.purchaseMessageService.getAllMessagesAndPrice(liveShoppingId);
  }

  /** 특정 라이브 쇼핑에 대한 관리자메시지(현황판 메시지) 조회 */
  @Get('/current-state-admin-message')
  getLiveShoppingStateBoardAdminMessage(
    @Query('liveShoppingId', ParseIntPipe) liveShoppingId: number,
  ): Promise<LiveShoppingStateBoardMessage | null> {
    return this.liveShoppingStateBoardService.findOneMessage(liveShoppingId);
  }

  /** 특정 라이브 쇼핑에 대한 현황판 경고알림 조회 */
  @Get('/current-state-admin-alert')
  getLiveShoppingStateBaordAdminAlert(
    @Query('liveShoppingId', ParseIntPipe) liveShoppingId: number,
  ): Promise<LiveShoppingStateBoardAlert | null> {
    return this.liveShoppingStateBoardService.findOneAlert(liveShoppingId);
  }

  /** 특정 라이브 쇼핑에 대한 현황판 경고알림 삭제 */
  @Delete('/current-state-admin-alert')
  deleteLiveShoppingStateBaordAdminAlert(
    @Body('liveShoppingId', ParseIntPipe) liveShoppingId: number,
  ): Promise<boolean> {
    return this.liveShoppingStateBoardService.deleteOneAlert(liveShoppingId);
  }
}
