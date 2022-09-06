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
  AdminReturnListDto,
  AdminReturnRes,
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
  LiveShoppingImageDto,
  LiveShoppingRegistByAdminDto,
  LiveShoppingSpecialPriceUpdateDto,
  LiveShoppingUpdateDTO,
  LiveShoppingWithGoods,
  OrderCancelRequestDetailRes,
  OrderCancelRequestList,
  PrivacyApproachHistoryDto,
  SellerGoodsSortColumn,
  SellerGoodsSortDirection,
  SellerSettlementTargetRes,
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
  ) {
    const wtIp = config.get('WHILETRUE_IP_ADDRESS');
    if (wtIp) this.allowedIpAddresses.push(wtIp);
  }

  // * 관리자 회원가입
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

  // * 이메일 주소 중복 체크
  @Get('email-check')
  public async emailDupCheck(
    @Query(ValidationPipe) dto: EmailDupCheckDto,
  ): Promise<boolean> {
    return this.adminAccountService.isEmailDupCheckOk(dto.email);
  }

  /** 판매자 정산 등록 정보 조회 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/settlement')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getSettlementInfo(): Promise<AdminSettlementInfoType> {
    return this.adminService.getSettlementInfo();
  }

  /** 판매자 정산 등록 정보 조회 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/settlement/targets')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  findSellerSettlementTargets(): Promise<SellerSettlementTargetRes> {
    return this.sellerSettlementService.findAllSettleTargetList();
  }

  /** 판매자 정산처리 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('/settlement')
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('seller/settlement', 'seller/settlement-history')
  async executeSettle(@Body(ValidationPipe) dto: ExecuteSettlementDto): Promise<boolean> {
    return this.sellerSettlementService.executeSettle(dto);
  }

  /** 판매자 정산 완료 목록 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/settlement-history')
  getSettlementHistory(): ReturnType<SellerSettlementService['findSettlementHistory']> {
    return this.sellerSettlementService.findSettlementHistory();
  }

  /** 방송인 정산 대상 목록 조회 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/settlement/broadcaster/targets')
  public async findBcSettlementTargets(
    @Query(new ValidationPipe({ transform: true })) dto: FindManyDto,
  ): Promise<BroadcasterSettlementTargets> {
    return this.settlementService.findSettlementTargets(undefined, dto);
  }

  /** 방송인 단일 정산처리 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('/settlement/broadcaster')
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('settlement-history')
  async executeBcSettle(
    @Body(ValidationPipe) dto: CreateManyBroadcasterSettlementHistoryDto,
  ): Promise<number> {
    return this.bcSettlementHistoryService.executeSettleMany(dto);
  }

  /** 방송인 정산 완료 목록 조회 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/settlement-history/broadcaster')
  public async findBroadcasterSettlementHistoriesByRound(): Promise<FindBcSettlementHistoriesRes> {
    return this.bcSettlementHistoryService.findHistories();
  }

  /** 판매자 정산 기본 수수료 변경 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('/sell-commission')
  updateSellCommission(
    @Body(ValidationPipe) dto: ChangeSellCommissionDto,
  ): Promise<boolean> {
    return this.adminService.updateSellCommission(dto.commissionRate);
  }

  /** 방송인 목록 조회 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/broadcasters')
  public async findBroadcasters(): Promise<Broadcaster[]> {
    return this.broadcasterService.getBroadcasters();
  }

  // 상품검수를 위한 상품 리스트
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

  // 상품검수를 위한 상품 상세 정보
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/goods/:goodsId')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getAdminGoodsById(
    @Param('goodsId', ParseIntPipe) goodsId: number,
  ): Promise<GoodsByIdRes> {
    return this.projectLcGoodsService.getOneGoods(goodsId);
  }

  // 상품 검수 승인을 수행
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('/goods/confirm')
  setGoodsConfirmation(@Body() dto: GoodsConfirmationDto): Promise<GoodsConfirmation> {
    return this.adminService.setGoodsConfirmation(dto);
  }

  // 상품 검수 반려를 수행
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('/goods/reject')
  setGoodsRejection(@Body() dto: GoodsRejectionDto): Promise<GoodsConfirmation> {
    return this.adminService.setGoodsRejection(dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('/live-shopping')
  async createLiveShoppingByAdmin(
    @Body(ValidationPipe) dto: LiveShoppingRegistByAdminDto,
  ): Promise<LiveShopping> {
    return this.liveShoppingService.createLiveShoppingByAdmin(dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/live-shoppings')
  async getLiveShoppings(
    @Query(new ValidationPipe({ transform: true })) dto: FindLiveShoppingDto,
  ): Promise<LiveShoppingWithGoods[]> {
    return this.liveShoppingService.findLiveShoppings(dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('/live-shopping/special-price/:specialPriceId')
  async updateLiveShoppingSpecialPriceData(
    @Param('specialPriceId', ParseIntPipe) specialPriceId: number,
    @Body() updateDto: LiveShoppingSpecialPriceUpdateDto,
  ): Promise<boolean> {
    return this.adminService.updateLiveShoppingSpecialPrice({
      id: specialPriceId,
      ...updateDto,
    });
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

  /** 라이브쇼핑 선물주문 목록 조회 */
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

  // 상품 검수 승인을 수행
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('/business-registration/confirm')
  setBusinessRegistrationConfirmation(
    @Body() dto: BusinessRegistrationConfirmationDto,
  ): Promise<BusinessRegistrationConfirmation> {
    return this.adminSettlementService.setBusinessRegistrationConfirmation(dto);
  }

  // 상품 검수 반려를 수행
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('/business-registration/reject')
  setBusinessRegistrationRejection(
    @Body() dto: BusinessRegistrationRejectionDto,
  ): Promise<BusinessRegistrationConfirmation> {
    return this.adminSettlementService.setBusinessRegistrationRejection(dto);
  }

  /** 결제취소 요청 목록 조회 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/order-cancel/list')
  getAllOrderCancelRequests(): Promise<OrderCancelRequestList> {
    return this.orderCancelService.getAllOrderCancelRequests();
  }

  /** 특정 주문에 대한 결제취소 요청 조회 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/order-cancel/:orderId')
  getOneOrderCancelRequest(
    @Param('orderId') orderId: string,
  ): Promise<OrderCancelRequestDetailRes> {
    return this.orderCancelService.getOneOrderCancelRequest(orderId);
  }

  /** 특정 주문에 대한 결제취소 요청 상태 변경 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('order-cancel')
  @Put('/order-cancel/:requestId')
  setOrderCancelRequestDone(
    @Param('requestId', ParseIntPipe) requestId: number,
  ): Promise<boolean> {
    return this.orderCancelService.setOrderCancelRequestDone(requestId);
  }

  /** 방송인 정산등록정보 신청 목록 조회 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/settelment-info-list/broadcaster')
  getBroadcasterSettlementInfoList(): Promise<AdminBroadcasterSettlementInfoList> {
    return this.broadcasterSettlementInfoService.getBroadcasterSettlementInfoList();
  }

  /** 방송인 정산정보 검수상태, 사유 수정 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('/settlement-info/broadcaster/confirmation')
  async setBroadcasterSettlementInfoConfirmation(
    @Body()
    dto: BroadcasterSettlementInfoConfirmationDto,
  ): Promise<boolean> {
    return this.adminSettlementService.setBroadcasterSettlementInfoConfirmation(dto);
  }

  /** 방송인 정산정보 검수 내역 생성 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('/settlement-info/confirmation/history')
  createSettlementConfirmHistory(
    @Body() dto: ConfirmHistoryDto,
  ): Promise<ConfirmHistory> {
    return this.sellerSettlementInfoService.createSettlementConfirmHistory(dto);
  }

  /** 전체 판매자 계정 목록 조회 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/sellers')
  @UseInterceptors(HttpCacheInterceptor)
  getSellerList(): Promise<AdminSellerListRes> {
    return this.sellerService.getSellerList();
  }

  /** ================================= */
  // 상품홍보 ProductPromotion
  /** ================================= */

  /** 전체 상품목록 조회
   * - 상품홍보에 연결하기 위한 상품(project-lc goods) 전체목록. 검수완료 & 정상판매중 일 것
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

  /** 관리자 환불처리위해 판매자에게 승인된 반품요청(Return) & 주문 & 결제정보 & 환불정보 조회 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/returns')
  async getAdminReturnList(
    @Query(new ValidationPipe({ transform: true })) dto: AdminReturnListDto,
  ): Promise<AdminReturnRes> {
    return this.returnService.getAdminReturnList(dto);
  }
}
