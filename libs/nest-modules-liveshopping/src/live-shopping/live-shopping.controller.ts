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
  LiveShoppingWithConfirmation,
} from '@project-lc/shared-types';
import { LiveShoppingService } from './live-shopping.service';

@UseGuards(JwtAuthGuard)
@Controller('live-shoppings')
export class LiveShoppingController {
  constructor(
    private readonly goodsService: GoodsService,
    private readonly liveShoppingService: LiveShoppingService,
  ) {}

  @Get()
  getLiveShoppings(
    @SellerInfo() seller: UserPayload,
    @Query(ValidationPipe) dto?: LiveShoppingParamsDto,
  ): Promise<LiveShoppingWithConfirmation[]> {
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
  ): Promise<LiveShoppingWithConfirmation[]> {
    return this.liveShoppingService.getBroadcasterRegisteredLiveShoppings(broadcasterId);
  }
}
