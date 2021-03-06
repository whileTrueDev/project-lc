import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  ForbiddenException,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AdminClassChangeHistory,
  Administrator,
  Broadcaster,
  BusinessRegistrationConfirmation,
  ConfirmHistory,
  GoodsConfirmation,
  LiveShopping,
  PrivacyApproachHistory,
} from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  BroadcasterService,
  BroadcasterSettlementHistoryService,
  BroadcasterSettlementInfoService,
  BroadcasterSettlementService,
} from '@project-lc/nest-modules-broadcaster';
import { GoodsService } from '@project-lc/nest-modules-goods';
import { LiveShoppingService } from '@project-lc/nest-modules-liveshopping';
import { OrderCancelService } from '@project-lc/nest-modules-order-cancel';
import { ReturnService } from '@project-lc/nest-modules-return';
import { RefundService } from '@project-lc/nest-modules-refund';
import {
  SellerService,
  SellerSettlementInfoService,
  SellerSettlementService,
} from '@project-lc/nest-modules-seller';
import {
  AdminAllLcGoodsList,
  AdminBroadcasterSettlementInfoList,
  AdminClassChangeHistoryDtoWithoutId,
  AdminClassDto,
  AdminGoodsListRes,
  AdminLiveShoppingGiftOrder,
  AdminSellerListRes,
  AdminSettlementInfoType,
  AdminSignUpDto,
  BroadcasterDTO,
  BroadcasterSettlementInfoConfirmationDto,
  BroadcasterSettlementTargets,
  BusinessRegistrationConfirmationDto,
  BusinessRegistrationRejectionDto,
  ChangeSellCommissionDto,
  ConfirmHistoryDto,
  CreateManyBroadcasterSettlementHistoryDto,
  EmailDupCheckDto,
  ExecuteSettlementDto,
  FindBcSettlementHistoriesRes,
  FindLiveShoppingDto,
  FindManyDto,
  GoodsByIdRes,
  GoodsConfirmationDto,
  GoodsRejectionDto,
  LiveShoppingUpdateDTO,
  LiveShoppingImageDto,
  OrderCancelRequestDetailRes,
  OrderCancelRequestList,
  PrivacyApproachHistoryDto,
  SellerGoodsSortColumn,
  SellerGoodsSortDirection,
  SellerSettlementTargetRes,
  AdminReturnRes,
  AdminRefundRes,
} from '@project-lc/shared-types';
import { Request } from 'express';
import { AdminAccountService } from './admin-account.service';
import { AdminPrivacyApproachSevice } from './admin-privacy-approach.service';
import { AdminSettlementService } from './admin-settlement.service';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  private allowedIpAddresses: string[] = ['::1'];
  constructor(
    private readonly adminService: AdminService,
    private readonly broadcasterService: BroadcasterService,
    private readonly adminSettlementService: AdminSettlementService,
    private readonly adminAccountService: AdminAccountService,
    private readonly sellerSettlementService: SellerSettlementService,
    private readonly sellerSettlementInfoService: SellerSettlementInfoService,
    private readonly orderCancelService: OrderCancelService,
    private readonly bcSettlementHistoryService: BroadcasterSettlementHistoryService,
    private readonly broadcasterSettlementInfoService: BroadcasterSettlementInfoService,
    private readonly sellerService: SellerService,
    private readonly liveShoppingService: LiveShoppingService,
    private readonly projectLcGoodsService: GoodsService,
    private readonly config: ConfigService,
    private readonly adminPrivacyApproachSevice: AdminPrivacyApproachSevice,
    private readonly settlementService: BroadcasterSettlementService,
    private readonly returnService: ReturnService,
    private readonly refundService: RefundService,
  ) {
    const wtIp = config.get('WHILETRUE_IP_ADDRESS');
    if (wtIp) this.allowedIpAddresses.push(wtIp);
  }

  // * ????????? ????????????
  @Post()
  public async signUp(
    @Req() req: Request,
    @Body(ValidationPipe) dto: AdminSignUpDto,
  ): Promise<Administrator> {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    if (!this.allowedIpAddresses.includes(ip)) {
      throw new ForbiddenException(`unexpected ip address - ${ip}`);
    }
    const administrator = await this.adminAccountService.signUp(dto);
    return administrator;
  }

  // * ????????? ?????? ?????? ??????
  @Get('email-check')
  public async emailDupCheck(
    @Query(ValidationPipe) dto: EmailDupCheckDto,
  ): Promise<boolean> {
    return this.adminAccountService.isEmailDupCheckOk(dto.email);
  }

  /** ????????? ?????? ?????? ?????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/settlement')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getSettlementInfo(): Promise<AdminSettlementInfoType> {
    return this.adminService.getSettlementInfo();
  }

  /** ????????? ?????? ?????? ?????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/settlement/targets')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  findSellerSettlementTargets(): Promise<SellerSettlementTargetRes> {
    return this.sellerSettlementService.findAllSettleTargetList();
  }

  /** ????????? ???????????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('/settlement')
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('seller/settlement', 'seller/settlement-history')
  async executeSettle(@Body(ValidationPipe) dto: ExecuteSettlementDto): Promise<boolean> {
    return this.sellerSettlementService.executeSettle(dto);
  }

  /** ????????? ?????? ?????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/settlement-history')
  getSettlementHistory(): ReturnType<SellerSettlementService['findSettlementHistory']> {
    return this.sellerSettlementService.findSettlementHistory();
  }

  /** ????????? ?????? ?????? ?????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/settlement/broadcaster/targets')
  public async findBcSettlementTargets(
    @Query(new ValidationPipe({ transform: true })) dto: FindManyDto,
  ): Promise<BroadcasterSettlementTargets> {
    return this.settlementService.findSettlementTargets(undefined, dto);
  }

  /** ????????? ?????? ???????????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('/settlement/broadcaster')
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('settlement-history')
  async executeBcSettle(
    @Body(ValidationPipe) dto: CreateManyBroadcasterSettlementHistoryDto,
  ): Promise<number> {
    return this.bcSettlementHistoryService.executeSettleMany(dto);
  }

  /** ????????? ?????? ?????? ?????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/settlement-history/broadcaster')
  public async findBroadcasterSettlementHistoriesByRound(): Promise<FindBcSettlementHistoriesRes> {
    return this.bcSettlementHistoryService.findHistories();
  }

  /** ????????? ?????? ?????? ????????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('/sell-commission')
  updateSellCommission(
    @Body(ValidationPipe) dto: ChangeSellCommissionDto,
  ): Promise<boolean> {
    return this.adminService.updateSellCommission(dto.commissionRate);
  }

  /** ????????? ?????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/broadcasters')
  public async findBroadcasters(): Promise<Broadcaster[]> {
    return this.broadcasterService.getBroadcasters();
  }

  // ??????????????? ?????? ?????? ?????????
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/goods')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getGoodsInfo(
    @Query('sort', new DefaultValuePipe(SellerGoodsSortColumn.REGIST_DATE))
    sort: SellerGoodsSortColumn,
    @Query('direction', new DefaultValuePipe(SellerGoodsSortDirection.DESC))
    direction: SellerGoodsSortDirection,
  ): Promise<AdminGoodsListRes> {
    return this.adminService.getGoodsInfo({
      sort,
      direction,
    });
  }

  // ??????????????? ?????? ?????? ?????? ??????
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/goods/:goodsId')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getAdminGoodsById(
    @Param('goodsId', ParseIntPipe) goodsId: number,
  ): Promise<GoodsByIdRes> {
    return this.projectLcGoodsService.getOneGoods(goodsId);
  }

  // ?????? ?????? ????????? ??????
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('/goods/confirm')
  setGoodsConfirmation(@Body() dto: GoodsConfirmationDto): Promise<GoodsConfirmation> {
    return this.adminService.setGoodsConfirmation(dto);
  }

  // ?????? ?????? ????????? ??????
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('/goods/reject')
  setGoodsRejection(@Body() dto: GoodsRejectionDto): Promise<GoodsConfirmation> {
    return this.adminService.setGoodsRejection(dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/live-shoppings')
  getLiveShoppings(
    @Query(new ValidationPipe({ transform: true })) dto: FindLiveShoppingDto,
  ): Promise<LiveShopping[]> {
    return this.liveShoppingService.findLiveShoppings(dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('live-shoppings')
  @Patch('/live-shopping')
  async updateLiveShoppings(
    @Body() data: { dto: LiveShoppingUpdateDTO; videoUrlExist?: boolean },
  ): Promise<boolean> {
    let videoId;
    if (data.dto.videoUrl) {
      if (data.videoUrlExist) {
        await this.adminService.deleteVideoUrl(data.dto.id);
      }
      videoId = await this.adminService.registVideoUrl(data.dto.videoUrl);
    }
    return this.adminService.updateLiveShoppings(data.dto, videoId);
  }

  /** ??????????????? ???????????? ?????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/live-shopping/:liveShoppingId/gift-orders')
  getLiveShoppingGiftOrders(
    @Param('liveShoppingId', ParseIntPipe) liveShoppingId: number,
  ): Promise<AdminLiveShoppingGiftOrder[]> {
    return this.adminService.getLiveShoppingGiftOrders(liveShoppingId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/live-shopping/broadcasters')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getAllBroadcasters(): Promise<BroadcasterDTO[]> {
    return this.broadcasterService.getAllBroadcasterIdAndNickname();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('/live-shopping/images')
  upsertLiveShoppingImage(@Body() dto: LiveShoppingImageDto): Promise<boolean> {
    return this.adminService.upsertLiveShoppingImage(dto);
  }

  // ?????? ?????? ????????? ??????
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('/business-registration/confirm')
  setBusinessRegistrationConfirmation(
    @Body() dto: BusinessRegistrationConfirmationDto,
  ): Promise<BusinessRegistrationConfirmation> {
    return this.adminSettlementService.setBusinessRegistrationConfirmation(dto);
  }

  // ?????? ?????? ????????? ??????
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('/business-registration/reject')
  setBusinessRegistrationRejection(
    @Body() dto: BusinessRegistrationRejectionDto,
  ): Promise<BusinessRegistrationConfirmation> {
    return this.adminSettlementService.setBusinessRegistrationRejection(dto);
  }

  /** ???????????? ?????? ?????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/order-cancel/list')
  getAllOrderCancelRequests(): Promise<OrderCancelRequestList> {
    return this.orderCancelService.getAllOrderCancelRequests();
  }

  /** ?????? ????????? ?????? ???????????? ?????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/order-cancel/:orderId')
  getOneOrderCancelRequest(
    @Param('orderId') orderId: string,
  ): Promise<OrderCancelRequestDetailRes> {
    return this.orderCancelService.getOneOrderCancelRequest(orderId);
  }

  /** ?????? ????????? ?????? ???????????? ?????? ?????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('order-cancel')
  @Put('/order-cancel/:requestId')
  setOrderCancelRequestDone(
    @Param('requestId', ParseIntPipe) requestId: number,
  ): Promise<boolean> {
    return this.orderCancelService.setOrderCancelRequestDone(requestId);
  }

  /** ????????? ?????????????????? ?????? ?????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/settelment-info-list/broadcaster')
  getBroadcasterSettlementInfoList(): Promise<AdminBroadcasterSettlementInfoList> {
    return this.broadcasterSettlementInfoService.getBroadcasterSettlementInfoList();
  }

  /** ????????? ???????????? ????????????, ?????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('/settlement-info/broadcaster/confirmation')
  async setBroadcasterSettlementInfoConfirmation(
    @Body()
    dto: BroadcasterSettlementInfoConfirmationDto,
  ): Promise<boolean> {
    return this.adminSettlementService.setBroadcasterSettlementInfoConfirmation(dto);
  }

  /** ????????? ???????????? ?????? ?????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('/settlement-info/confirmation/history')
  createSettlementConfirmHistory(
    @Body() dto: ConfirmHistoryDto,
  ): Promise<ConfirmHistory> {
    return this.sellerSettlementInfoService.createSettlementConfirmHistory(dto);
  }

  /** ?????? ????????? ?????? ?????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/sellers')
  @UseInterceptors(HttpCacheInterceptor)
  getSellerList(): Promise<AdminSellerListRes> {
    return this.sellerService.getSellerList();
  }

  /** ================================= */
  // ???????????? ProductPromotion
  /** ================================= */

  /** ?????? ???????????? ??????
   * - ??????????????? ???????????? ?????? ??????(project-lc goods) ????????????. ???????????? & ??????????????? ??? ???
   * goodsConfirmation.status === confirmed && goods.status === normal
   * goodsId, goodsName, sellerId, sellerEmail
   * */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('confirmed-goods-list')
  async findAllConfirmedLcGoodsList(): Promise<AdminAllLcGoodsList> {
    return this.projectLcGoodsService.findAllConfirmedLcGoodsList();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('confirmed-goods-list-category')
  async findAllConfirmedLcGoodsListWithCategory(): Promise<AdminAllLcGoodsList> {
    return this.projectLcGoodsService.findAllConfirmedLcGoodsListWithCategory();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('privacy-approach-history')
  async createPrivacyApproachHistory(
    @Req() req: Request,
    @Body() dto: PrivacyApproachHistoryDto,
  ): Promise<PrivacyApproachHistory> {
    return this.adminPrivacyApproachSevice.createPrivacyApproachHistory(req, dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('class-change-history')
  async createClassChangeHistory(
    @Body() dto: AdminClassChangeHistoryDtoWithoutId,
  ): Promise<AdminClassChangeHistory> {
    return this.adminService.createAdminClassChangeHistory(dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/admin-managers')
  async getAdminUserList(): Promise<AdminClassDto[]> {
    return this.adminService.getAdminUserList();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('/admin-class')
  async updateAdminClass(@Body() dto: AdminClassDto): Promise<Administrator> {
    return this.adminService.updateAdminClass(dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('/user/:userId')
  async deleteAdminUser(@Param('userId') userId: number): Promise<boolean> {
    return this.adminService.deleteAdminUser(userId);
  }

  /** ????????? ?????????????????? ??????????????? ????????? ????????????(Return) & ?????? & ???????????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/returns')
  async getAdminReturnList(): Promise<AdminReturnRes> {
    return this.returnService.getAdminReturnList();
  }

  /** ????????? ??????????????????(Refund) ?????? ?????? */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/refunds')
  async getAdminRefundList(): Promise<AdminRefundRes> {
    return this.refundService.getAdminRefundList();
  }
}
