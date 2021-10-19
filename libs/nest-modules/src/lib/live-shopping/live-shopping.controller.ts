import {
  Controller,
  Get,
  UseGuards,
  Query,
  Post,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { ApprovedGoodsNameAndId, LiveShoppingDTO } from '@project-lc/shared-types';
import { GoodsService } from '../goods/goods.service';
import { LiveShoppingService } from './live-shopping.service';
import { SellerInfo } from '../_nest-units/decorators/sellerInfo.decorator';
import { UserPayload } from '../auth/auth.interface';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('live-shopping')
export class LiveShoppingController {
  constructor(
    private readonly goodsService: GoodsService,
    private readonly liveShoppingService: LiveShoppingService,
  ) {}

  /** 상품 등록 */
  @Post()
  createLiveShopping(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: LiveShoppingDTO,
  ): Promise<{ liveShoppingId: number }> {
    const email = seller.sub;
    return this.liveShoppingService.createLiveShopping(email, dto);
  }

  @Get('/confirmed-goods')
  async getApprovedGoodsList(
    @Query('email') email: string,
  ): Promise<ApprovedGoodsNameAndId[]> {
    const goodsList = await this.goodsService.findMyGoodsNames(email);
    return goodsList;
  }
}
