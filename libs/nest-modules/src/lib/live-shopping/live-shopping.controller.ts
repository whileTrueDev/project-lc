import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApprovedGoodsNameAndId,
  LiveShoppingRegistDTO,
  LiveShoppingParamsDto,
  LiveShoppingWithConfirmation,
} from '@project-lc/shared-types';
import { UserPayload } from '../auth/auth.interface';
import { GoodsService } from '../goods/goods.service';
import { SellerInfo } from '../_nest-units/decorators/sellerInfo.decorator';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
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

  @Get('/broadcaster/fm-connection-id')
  async getLiveShoppingLinkFmGoodsId(
    @Query('broadcasterId') broadcasterId: number,
  ): Promise<any> {
    return this.liveShoppingService.getLinkedLiveShoppingFmGoodsId(broadcasterId);
  }
}
