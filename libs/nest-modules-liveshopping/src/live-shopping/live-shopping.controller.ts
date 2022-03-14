import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { LiveShopping, LiveShoppingPurchaseMessage } from '@prisma/client';
import { HttpCacheInterceptor, SellerInfo, UserPayload } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { GoodsService } from '@project-lc/nest-modules-goods';
import {
  ApprovedGoodsNameAndId,
  LiveShoppingParamsDto,
  LiveShoppingRegistDTO,
} from '@project-lc/shared-types';
import { LiveShoppingService } from './live-shopping.service';
import { PurchaseMessageService } from './purchase-message.service';

@UseGuards(JwtAuthGuard)
@Controller('live-shoppings')
export class LiveShoppingController {
  constructor(
    private readonly goodsService: GoodsService,
    private readonly liveShoppingService: LiveShoppingService,
    private readonly purchaseMessageService: PurchaseMessageService,
  ) {}

  @Get()
  @UseInterceptors(HttpCacheInterceptor)
  getLiveShoppings(
    @SellerInfo() seller: UserPayload,
    @Query(ValidationPipe) dto?: LiveShoppingParamsDto,
  ): Promise<LiveShopping[]> {
    return this.liveShoppingService.getRegisteredLiveShoppings(seller.id, dto);
  }

  /** 라이브쇼핑 등록 */
  @Post()
  createLiveShopping(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: LiveShoppingRegistDTO,
  ): Promise<{ liveShoppingId: number }> {
    return this.liveShoppingService.createLiveShopping(seller.id, dto);
  }

  @Delete()
  deleteLiveShopping(
    @Body(ValidationPipe) liveShoppingId: { liveShoppingId: number },
  ): Promise<boolean> {
    return this.liveShoppingService.deleteLiveShopping(liveShoppingId);
  }

  @Get('/confirmed-goods')
  async getApprovedGoodsList(
    @SellerInfo() seller: UserPayload,
  ): Promise<ApprovedGoodsNameAndId[]> {
    const sellerId = seller.id;
    const goodsList = await this.goodsService.findMyGoodsNames(sellerId);
    return goodsList;
  }

  @Get('/broadcaster')
  @UseInterceptors(HttpCacheInterceptor)
  getBroadcasterLiveShoppings(
    @Query('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<LiveShopping[]> {
    return this.liveShoppingService.getBroadcasterRegisteredLiveShoppings(broadcasterId);
  }

  /** 특정 라이브 쇼핑에 대한 응원메시지 목록 데이터 조회 */
  @Get('/current-state-purchase-messages')
  @UseInterceptors(HttpCacheInterceptor)
  getLiveShoppingCurrentPurchaseMessagesAndPrice(
    @Query('liveShoppingId', ParseIntPipe) liveShoppingId: number,
  ): Promise<LiveShoppingPurchaseMessage[]> {
    return this.purchaseMessageService.getAllMessagesAndPrice(liveShoppingId);
  }
}
