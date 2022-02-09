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
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Administrator,
  BusinessRegistrationConfirmation,
  GoodsConfirmation,
  LiveShopping,
} from '@prisma/client';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  BroadcasterPromotionPageService,
  BroadcasterService,
  BroadcasterSettlementHistoryService,
  BroadcasterSettlementService,
} from '@project-lc/nest-modules-broadcaster';
import { OrderCancelService } from '@project-lc/nest-modules-order-cancel';
import { SellerService, SellerSettlementService } from '@project-lc/nest-modules-seller';
import {
  AdminBroadcasterSettlementInfoList,
  AdminSellerListRes,
  AdminSettlementInfoType,
  AdminSignUpDto,
  BroadcasterDTO,
  BroadcasterPromotionPageDto,
  BroadcasterPromotionPageListRes,
  BroadcasterPromotionPageUpdateDto,
  BroadcasterSettlementInfoConfirmationDto,
  BusinessRegistrationConfirmationDto,
  BusinessRegistrationRejectionDto,
  ChangeSellCommissionDto,
  CreateManyBroadcasterSettlementHistoryDto,
  CreateProductPromotionDto,
  EmailDupCheckDto,
  ExecuteSettlementDto,
  FindBcSettlementHistoriesRes,
  GoodsByIdRes,
  GoodsConfirmationDto,
  GoodsRejectionDto,
  LiveShoppingDTO,
  OrderCancelRequestDetailRes,
  OrderCancelRequestList,
  SellerGoodsSortColumn,
  SellerGoodsSortDirection,
} from '@project-lc/shared-types';
import { Request } from 'express';
import { ProductPromotionService } from '@project-lc/nest-modules-product-promotion';
import { AdminAccountService } from './admin-account.service';
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
    private readonly orderCancelService: OrderCancelService,
    private readonly bcSettlementHistoryService: BroadcasterSettlementHistoryService,
    private readonly broadcasterSettlementService: BroadcasterSettlementService,
    private readonly sellerService: SellerService,
    private readonly broadcasterPromotionPageService: BroadcasterPromotionPageService,
    private readonly productPromotionService: ProductPromotionService,
    private readonly config: ConfigService,
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

  /** 판매자 정산처리 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('/settlement')
  executeSettle(@Body(ValidationPipe) dto: ExecuteSettlementDto): Promise<boolean> {
    if (dto.target.options.length === 0) return null;
    return this.sellerSettlementService.executeSettle(dto.sellerEmail, dto);
  }

  /** 판매자 정산 완료 목록 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/settlement-history')
  getSettlementHistory(): ReturnType<SellerSettlementService['findSettlementHistory']> {
    return this.sellerSettlementService.findSettlementHistory();
  }

  /** 방송인 단일 정산처리 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('/settlement/broadcaster')
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

  // 상품검수를 위한 상품 리스트
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/goods')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getGoodsInfo(
    @Query('sort', new DefaultValuePipe(SellerGoodsSortColumn.REGIST_DATE))
    sort: SellerGoodsSortColumn,
    @Query('direction', new DefaultValuePipe(SellerGoodsSortDirection.DESC))
    direction: SellerGoodsSortDirection,
  ) {
    return this.adminService.getGoodsInfo({
      sort,
      direction,
    });
  }

  // 상품검수를 위한 상품 리스트
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/goods/:goodsId')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getAdminGoodsById(@Param('goodsId') goodsId: string | number): Promise<GoodsByIdRes> {
    return this.adminService.getOneGoods(goodsId);
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
  @Get('/live-shoppings')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getLiveShoppings(@Query('liveShoppingId') dto?: string): Promise<LiveShopping[]> {
    return this.adminService.getRegisteredLiveShoppings(dto || null);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('/live-shopping')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  async updateLiveShoppings(
    @Body() data: { dto: LiveShoppingDTO; videoUrlExist?: boolean },
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

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/live-shopping/broadcasters')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getAllBroadcasters(): Promise<BroadcasterDTO[]> {
    return this.broadcasterService.getAllBroadcasterIdAndNickname();
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
    return this.broadcasterSettlementService.getBroadcasterSettlementInfoList();
  }

  /** 방송인 정산정보 검수상태, 사유 수정 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('/settlement-info/broadcaster/confirmation')
  setBroadcasterSettlementInfoConfirmation(
    @Body()
    dto: BroadcasterSettlementInfoConfirmationDto,
  ): Promise<boolean> {
    return this.adminSettlementService.setBroadcasterSettlementInfoConfirmation(dto);
  }

  /** 전체 판매자 계정 목록 조회 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/sellers')
  getSellerList(): Promise<AdminSellerListRes> {
    return this.sellerService.getSellerList();
  }

  /** ================================= */
  // 방송인 상품홍보페이지 BroadcasterPromotionPage
  /** ================================= */

  /** 방송인 상품홍보페이지 생성 */
  @Post('/promotion-page')
  async createPromotionPage(
    @Body(ValidationPipe) dto: BroadcasterPromotionPageDto,
  ): Promise<any> {
    return this.broadcasterPromotionPageService.createPromotionPage(dto);
  }

  /** 상품홍보페이지 수정 */
  @Patch('/promotion-page')
  async updatePromotionPage(
    @Body(ValidationPipe) dto: BroadcasterPromotionPageUpdateDto,
  ): Promise<any> {
    return this.broadcasterPromotionPageService.updatePromotionPage(dto);
  }

  /** 방송인 상품홍보페이지 url 중복 확인
   * @query url
   * @return 중복 url이면 true, 중복이 아니면 false
   */
  @Get('/promotion-page/duplicate')
  async checkPromotionPageUrlDuplicate(@Query('url') url: string): Promise<boolean> {
    return this.broadcasterPromotionPageService.checkPromotionPageUrlDuplicate(url);
  }

  /**
   * 방송인 상품홍보페이지 삭제
   * @param pageId 방송인 상품홍보페이지 id
   * @returns 삭제 성공시 true
   */
  @Delete('/promotion-page/:pageId')
  async deletePromotionPage(
    @Param('pageId', ParseIntPipe) pageId: number,
  ): Promise<boolean> {
    return this.broadcasterPromotionPageService.deletePromotionPage(pageId);
  }

  /** 상품홍보페이지 목록 조회 */
  @Get('/promotion-pages')
  async getBroadcasterPromotionPageList(): Promise<BroadcasterPromotionPageListRes> {
    return this.broadcasterPromotionPageService.getBroadcasterPromotionPageList();
  }

  /** ================================= */
  // 상품홍보 ProductPromotion
  /** ================================= */
  @Post('/product-promotion')
  async createProductPromotion(
    @Body(ValidationPipe) dto: CreateProductPromotionDto,
  ): Promise<any> {
    return this.productPromotionService.createProductPromotion(dto);
  }
}
