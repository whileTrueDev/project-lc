import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { LiveShoppingPurchaseMessage } from '@prisma/client';
import {
  CacheClearKeys,
  HttpCacheInterceptor,
  SellerInfo,
  UserPayload,
} from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { GoodsService } from '@project-lc/nest-modules-goods';
import {
  ApprovedGoodsListItem,
  FindLiveShoppingDto,
  FindNowPlayingLiveShoppingDto,
  LiveShoppingOutline,
  LiveShoppingRegistDTO,
  LiveShoppingWithGoods,
} from '@project-lc/shared-types';
import { LiveShoppingService } from './live-shopping.service';
import { PurchaseMessageService } from './purchase-message.service';

@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('live-shoppings')
@Controller('live-shoppings')
export class LiveShoppingController {
  constructor(
    private readonly goodsService: GoodsService,
    private readonly liveShoppingService: LiveShoppingService,
    private readonly purchaseMessageService: PurchaseMessageService,
  ) {}

  @Get(':liveShoppingId')
  public getLiveShopping(
    @Param('liveShoppingId', ParseIntPipe) id: number,
  ): Promise<LiveShoppingWithGoods> {
    return this.liveShoppingService.findLiveShopping(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getLiveShoppings(
    @Query(new ValidationPipe({ transform: true })) dto?: FindLiveShoppingDto,
  ): Promise<LiveShoppingWithGoods[]> {
    if (!dto || !(dto.broadcasterId || dto.goodsIds || dto.id || dto.sellerId))
      throw new BadRequestException(
        'broadcasterId, goodsIds, id, sellerId 파라미터 중 하나를 포함해야 합니다.',
      );
    return this.liveShoppingService.findLiveShoppings(dto);
  }

  /** 라이브쇼핑 등록 */
  @Post()
  @UseGuards(JwtAuthGuard)
  createLiveShopping(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: LiveShoppingRegistDTO,
  ): Promise<{ liveShoppingId: number }> {
    return this.liveShoppingService.createLiveShopping(seller.id, dto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteLiveShopping(
    @Body(ValidationPipe) liveShoppingId: { liveShoppingId: number },
  ): Promise<boolean> {
    return this.liveShoppingService.deleteLiveShopping(liveShoppingId);
  }

  @Get('/confirmed-goods')
  @UseGuards(JwtAuthGuard)
  async getApprovedGoodsList(
    @SellerInfo() seller: UserPayload,
  ): Promise<ApprovedGoodsListItem[]> {
    const sellerId = seller.id;
    const goodsList = await this.goodsService.findMyGoodsNames(sellerId);
    return goodsList;
  }

  /** 특정 라이브 쇼핑에 대한 응원메시지 목록 데이터 조회 */
  @Get('/current-state-purchase-messages')
  @UseGuards(JwtAuthGuard)
  getLiveShoppingCurrentPurchaseMessagesAndPrice(
    @Query('liveShoppingId', ParseIntPipe) liveShoppingId: number,
  ): Promise<LiveShoppingPurchaseMessage[]> {
    return this.purchaseMessageService.getAllMessagesAndPrice(liveShoppingId);
  }

  @Get('now-on-live')
  async getNowPlayingLiveShopping(
    @Query(new ValidationPipe({ transform: true })) dto: FindNowPlayingLiveShoppingDto,
  ): Promise<LiveShoppingOutline[]> {
    if (dto.broadcasterId || dto.goodsId || dto.goodsIds) {
      return this.liveShoppingService.getNowPlayingLiveShopping(dto);
    }
    return [];
  }
}
