import { Controller, Get, Param, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { FindFmOrderDetailRes, FindFmOrdersDto } from '@project-lc/shared-types';
import {
  JwtAuthGuard,
  SellerInfo,
  UserPayload,
  GoodsService,
} from '@project-lc/nest-modules';
import { FmOrdersService } from './fm-orders.service';

@UseGuards(JwtAuthGuard)
@Controller('fm-orders')
export class FmOrdersController {
  constructor(
    private readonly projectLcGoodsService: GoodsService,
    private readonly fmOrdersService: FmOrdersService,
  ) {}

  @Get()
  async findOrders(
    @SellerInfo() seller: UserPayload,
    @Query(ValidationPipe) dto: FindFmOrdersDto,
  ) {
    // 판매자의 승인된 상품 ID 목록 조회
    const ids = await this.projectLcGoodsService.findMyGoodsIds(seller.sub);
    if (ids.length === 0) return [];
    return this.fmOrdersService.findOrders(ids, dto);
  }

  @Get(':orderId')
  async findOneOrder(
    @Param('orderId') orderId: string,
  ): Promise<FindFmOrderDetailRes | null> {
    return this.fmOrdersService.findOneOrder(orderId);
  }
}
