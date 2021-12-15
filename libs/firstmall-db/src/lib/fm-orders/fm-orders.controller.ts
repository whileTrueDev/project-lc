import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import {
  GoodsService,
  JwtAuthGuard,
  SellerInfo,
  UserPayload,
  LiveShoppingService,
  AdminGuard,
} from '@project-lc/nest-modules';
import {
  ChangeFmOrderStatusDto,
  convertFmStatusStringToStatus,
  FindFmOrderDetailRes,
  FindFmOrderRes,
  FindFmOrdersDto,
  OrderStats,
  OrderStatsRes,
  SalesStats,
  ChangeReturnStatusDto,
  BroadcasterPurchaseDto,
  FindFmOrderDetailsDto,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';

import { FmOrdersService } from './fm-orders.service';
@UseGuards(JwtAuthGuard)
@Controller('fm-orders')
export class FmOrdersController {
  constructor(
    private readonly projectLcGoodsService: GoodsService,
    private readonly fmOrdersService: FmOrdersService,
    private readonly liveShoppingService: LiveShoppingService,
  ) {}

  /** 주문 목록 조회 */
  @Get()
  async findOrders(
    @SellerInfo() seller: UserPayload,
    @Query(ValidationPipe) dto: FindFmOrdersDto,
  ): Promise<FindFmOrderRes[]> {
    let gids: number[] | undefined; // 크크쇼 상품 고유 번호
    if (dto.goodsIds && dto.goodsIds.length > 0) {
      gids = dto.goodsIds.map((x) => Number(x));
    }
    // 판매자의 승인된 상품 ID 목록 조회
    const ids = await this.projectLcGoodsService.findMyGoodsIds(seller.sub, gids);
    if (ids.length === 0) return [];
    return this.fmOrdersService.findOrders(ids, dto);
  }

  @Patch('/return-status')
  async changeReturnStatus(
    @Body(ValidationPipe) dto: ChangeReturnStatusDto,
  ): Promise<boolean> {
    return this.fmOrdersService.changeReturnStatus(dto);
  }

  /** 관리자페이지 결제취소요청에서 개별 주문 조회 */
  @UseGuards(AdminGuard)
  @Get('/admin/:orderId')
  async findAdminOneOrder(
    @Param('orderId') orderId: string,
    @Query('sellerEmail') sellerEmail: string,
  ): Promise<FindFmOrderDetailRes | null> {
    // 판매자의 승인된 상품 ID 목록 조회
    const ids = await this.projectLcGoodsService.findMyGoodsIds(sellerEmail);
    return this.fmOrdersService.findOneOrder(orderId, ids);
  }

  @UseGuards(AdminGuard)
  @Get('/admin')
  async findAdminOrders(
    @Query(ValidationPipe) dto: FindFmOrdersDto,
  ): Promise<FindFmOrderRes[]> {
    let gids: number[] | undefined; // 크크쇼 상품 고유 번호
    if (dto.goodsIds && dto.goodsIds.length > 0) {
      gids = dto.goodsIds.map((x) => Number(x));
    }
    // 판매자의 승인된 상품 ID 목록 조회
    const ids = await this.projectLcGoodsService.findAdminGoodsIds(gids);
    if (ids.length === 0) return [];
    return this.fmOrdersService.findOrders(ids, dto);
  }

  /** 마이페이지 요약지표 조회 */
  @Get('/stats')
  async getOrdersStats(@SellerInfo() seller: UserPayload): Promise<OrderStatsRes> {
    // 판매자의 승인된 상품 ID 목록 조회
    const ids = await this.projectLcGoodsService.findMyGoodsIds(seller.sub);
    if (ids.length === 0)
      return {
        sales: new SalesStats(),
        orders: new OrderStats(),
      };
    return this.fmOrdersService.getOrdersStats(ids);
  }

  @Get('/per-live-shopping')
  async findSalesPerLiveShopping(
    @SellerInfo() seller: UserPayload,
  ): Promise<{ id: number; sales: string }[]> {
    let liveShoppingList = await this.liveShoppingService
      .getRegisteredLiveShoppings(seller.sub, {})
      .then((result) => {
        return result.map((val) => {
          if (val.sellStartDate && val.sellEndDate) {
            return {
              id: val.id,
              firstmallGoodsConnectionId: `${val.goods.confirmation.firstmallGoodsConnectionId}`,
              sellStartDate: dayjs(val.sellStartDate).toString(),
              sellEndDate: dayjs(val.sellEndDate).toString(),
            };
          }
          return null;
        });
      });

    liveShoppingList = liveShoppingList?.filter((n) => n);
    return this.fmOrdersService.getOrdersStatsDuringLiveShoppingSales(liveShoppingList);
  }

  @Get('/broadcaster/per-live-shopping')
  async broadcasterFindSalesPerLiveShopping(
    @Query('broadcasterId') broadcasterId: number,
  ): Promise<{ id: number; sales: string }[]> {
    let liveShoppingList = await this.liveShoppingService
      .getBroadcasterRegisteredLiveShoppings(broadcasterId)
      .then((result) => {
        return result.map((val) => {
          if (val.sellStartDate && val.sellEndDate) {
            return {
              id: val.id,
              firstmallGoodsConnectionId: `${val.goods.confirmation.firstmallGoodsConnectionId}`,
              sellStartDate: dayjs(val.sellStartDate).toString(),
              sellEndDate: dayjs(val.sellEndDate).toString(),
            };
          }
          return null;
        });
      });

    liveShoppingList = liveShoppingList?.filter((n) => n);
    return this.fmOrdersService.getOrdersStatsDuringLiveShoppingSales(liveShoppingList);
  }

  @Get('detail')
  async findOrderDetails(
    @SellerInfo() seller: UserPayload,
    @Query(ValidationPipe) dto: FindFmOrderDetailsDto,
  ): Promise<FindFmOrderDetailRes[]> {
    // 판매자의 승인된 상품 ID 목록 조회
    const ids = await this.projectLcGoodsService.findMyGoodsIds(seller.sub);
    const result = await Promise.all(
      dto.orderIds.map((orderId) => {
        return this.fmOrdersService.findOneOrder(orderId, ids);
      }),
    );
    return result;
  }

  /** 개별 주문 조회 */
  @Get(':orderId')
  async findOneOrder(
    @SellerInfo() seller: UserPayload,
    @Param('orderId') orderId: string,
  ): Promise<FindFmOrderDetailRes | null> {
    // 판매자의 승인된 상품 ID 목록 조회
    const ids = await this.projectLcGoodsService.findMyGoodsIds(seller.sub);
    return this.fmOrdersService.findOneOrder(orderId, ids);
  }

  @Put(':orderId')
  async changeOrderStatus(
    @Param('orderId') orderId: string,
    @Body(ValidationPipe) dto: ChangeFmOrderStatusDto,
  ): Promise<boolean> {
    const status = convertFmStatusStringToStatus(dto.targetStatus);
    return this.fmOrdersService.changeOrderStatus(orderId, status);
  }

  @Get('/broadcaster/purchases')
  async getBroadcasterPurchases(
    @Param('broadcasterId')
    broadcasterId: number,
  ): Promise<BroadcasterPurchaseDto> {
    const linkedLiveShoppingFmGoodsIds =
      await this.liveShoppingService.getFmGoodsConnectionIdLinkedToLiveShopping(
        broadcasterId,
      );
    const purchasedList =
      await this.fmOrdersService.getPurchaseDoneOrderDuringLiveShopping(
        linkedLiveShoppingFmGoodsIds,
      );
    return purchasedList;
  }
}
