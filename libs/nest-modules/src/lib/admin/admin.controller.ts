import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  BusinessRegistrationConfirmation,
  GoodsConfirmation,
  LiveShopping,
  Administrator,
} from '@prisma/client';
import {
  AdminBroadcasterSettlementInfoList,
  AdminSettlementInfoType,
  BroadcasterDTO,
  BroadcasterSettlementInfoConfirmationDto,
  BusinessRegistrationConfirmationDto,
  BusinessRegistrationRejectionDto,
  ChangeSellCommissionDto,
  ExecuteSettlementDto,
  GoodsByIdRes,
  GoodsConfirmationDto,
  GoodsRejectionDto,
  LiveShoppingDTO,
  OrderCancelRequestDetailRes,
  OrderCancelRequestList,
  SellerGoodsSortColumn,
  SellerGoodsSortDirection,
  EmailDupCheckDto,
  AdminSignUpDto,
} from '@project-lc/shared-types';
import { BroadcasterSettlementService } from '../broadcaster/broadcaster-settlement.service';
import { BroadcasterService } from '../broadcaster/broadcaster.service';
import { OrderCancelService } from '../order-cancel/order-cancel.service';
import { SellerSettlementService } from '../seller/seller-settlement.service';
import { AdminGuard } from '../_nest-units/guards/admin.guard';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
import { AdminSettlementService } from './admin-settlement.service';
import { AdminAccountService } from './admin-account.service';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard)
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly broadcasterService: BroadcasterService,
    private readonly adminSettlementService: AdminSettlementService,
    private readonly adminAccountService: AdminAccountService,
    private readonly sellerSettlementService: SellerSettlementService,
    private readonly orderCancelService: OrderCancelService,
    private readonly broadcasterSettlementService: BroadcasterSettlementService,
  ) {}

  // * 판매자 회원가입
  @Post()
  public async signUp(@Body(ValidationPipe) dto: AdminSignUpDto): Promise<Administrator> {
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

  @Get('/settlement')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getSettlementInfo(): Promise<AdminSettlementInfoType> {
    return this.adminService.getSettlementInfo();
  }

  @Post('/settlement')
  executeSettle(@Body(ValidationPipe) dto: ExecuteSettlementDto): Promise<boolean> {
    if (dto.target.options.length === 0) return null;
    return this.sellerSettlementService.executeSettle(dto.sellerEmail, dto);
  }

  @Get('/settlement-history')
  getSettlementHistory(): ReturnType<SellerSettlementService['findSettlementHistory']> {
    return this.sellerSettlementService.findSettlementHistory();
  }

  @Put('/sell-commission')
  updateSellCommission(
    @Body(ValidationPipe) dto: ChangeSellCommissionDto,
  ): Promise<boolean> {
    return this.adminService.updateSellCommission(dto.commissionRate);
  }

  // 상품검수를 위한 상품 리스트
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
  @Get('/goods/:goodsId')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getAdminGoodsById(@Param('goodsId') goodsId: string | number): Promise<GoodsByIdRes> {
    return this.adminService.getOneGoods(goodsId);
  }

  // 상품 검수 승인을 수행
  @Put('/goods/confirm')
  setGoodsConfirmation(@Body() dto: GoodsConfirmationDto): Promise<GoodsConfirmation> {
    return this.adminService.setGoodsConfirmation(dto);
  }

  // 상품 검수 반려를 수행
  @Put('/goods/reject')
  setGoodsRejection(@Body() dto: GoodsRejectionDto): Promise<GoodsConfirmation> {
    return this.adminService.setGoodsRejection(dto);
  }

  @Get('/live-shoppings')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getLiveShoppings(@Query('liveShoppingId') dto?: string): Promise<LiveShopping[]> {
    return this.adminService.getRegisteredLiveShoppings(dto || null);
  }

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

  @Get('/live-shopping/broadcasters')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getAllBroadcasters(): Promise<BroadcasterDTO[]> {
    return this.broadcasterService.getAllBroadcasterIdAndNickname();
  }

  // 상품 검수 승인을 수행
  @Put('/business-registration/confirm')
  setBusinessRegistrationConfirmation(
    @Body() dto: BusinessRegistrationConfirmationDto,
  ): Promise<BusinessRegistrationConfirmation> {
    return this.adminSettlementService.setBusinessRegistrationConfirmation(dto);
  }

  // 상품 검수 반려를 수행
  @Put('/business-registration/reject')
  setBusinessRegistrationRejection(
    @Body() dto: BusinessRegistrationRejectionDto,
  ): Promise<BusinessRegistrationConfirmation> {
    return this.adminSettlementService.setBusinessRegistrationRejection(dto);
  }

  /** 결제취소 요청 목록 조회 */
  @Get('/order-cancel/list')
  getAllOrderCancelRequests(): Promise<OrderCancelRequestList> {
    return this.orderCancelService.getAllOrderCancelRequests();
  }

  /** 특정 주문에 대한 결제취소 요청 조회 */
  @Get('/order-cancel/:orderId')
  getOneOrderCancelRequest(
    @Param('orderId') orderId: string,
  ): Promise<OrderCancelRequestDetailRes> {
    return this.orderCancelService.getOneOrderCancelRequest(orderId);
  }

  /** 특정 주문에 대한 결제취소 요청 상태 변경 */
  @Put('/order-cancel/:requestId')
  setOrderCancelRequestDone(
    @Param('requestId', ParseIntPipe) requestId: number,
  ): Promise<boolean> {
    return this.orderCancelService.setOrderCancelRequestDone(requestId);
  }

  /** 방송인 정산정보 신청 목록 조회 */
  @Get('/settelment-info-list/broadcaster')
  getBroadcasterSettlementInfoList(): Promise<AdminBroadcasterSettlementInfoList> {
    return this.broadcasterSettlementService.getBroadcasterSettlementInfoList();
  }

  /** 방송인 정산정보 검수상태, 사유 수정 */
  @Patch('/settlement-info/broadcaster/confirmation')
  setBroadcasterSettlementInfoConfirmation(
    @Body()
    dto: BroadcasterSettlementInfoConfirmationDto,
  ): Promise<boolean> {
    return this.adminSettlementService.setBroadcasterSettlementInfoConfirmation(dto);
  }
}
