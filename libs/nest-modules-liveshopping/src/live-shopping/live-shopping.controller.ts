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
import { LiveShopping, LiveShoppingPurchaseMessage } from '@prisma/client';
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

  /** 특정 라이브 쇼핑의 현황(응원메시지 데이터) */
  @Get('/current-state')
  getLiveShoppingCurrentMessagesAndPrice(
    @Query('liveShoppingId', ParseIntPipe) liveShoppingId: number,
  ): Promise<LiveShoppingPurchaseMessage[]> {
    return this.purchaseMessageService.getAllMessagesAndPrice(liveShoppingId);
  }
}
