import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  GoodsService,
  JwtAuthGuard,
  SellerInfo,
  UserPayload,
} from '@project-lc/nest-modules';
import {
  ChangeFmOrderStatusDto,
  convertFmStatusStringToStatus,
  FindFmOrderDetailRes,
  FindFmOrderRes,
  FindFmOrdersDto,
} from '@project-lc/shared-types';
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
  ): Promise<FindFmOrderRes[]> {
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

  @Put(':orderId')
  async changeOrderStatus(
    @Param('orderId') orderId: string,
    @Body(ValidationPipe) dto: ChangeFmOrderStatusDto,
  ): Promise<boolean> {
    const status = convertFmStatusStringToStatus(dto.targetStatus);
    return this.fmOrdersService.changeOrderStatus(orderId, status);
  }
}
