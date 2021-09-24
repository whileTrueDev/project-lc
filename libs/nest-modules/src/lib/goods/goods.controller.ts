import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ChangeGoodsViewDto,
  DeleteGoodsDto,
  GoodsInfoDto,
  RegistGoodsDto,
  SellerGoodsSortColumn,
  SellerGoodsSortDirection,
} from '@project-lc/shared-types';
import { GoodsService } from './goods.service';
import { SellerInfo } from '../_nest-units/decorators/sellerInfo.decorator';
import { UserPayload } from '../auth/auth.interface';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  /** 상품 목록 조회 */
  @Get('/list')
  getGoodsList(
    @SellerInfo() seller: UserPayload,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('itemPerPage', new DefaultValuePipe(10), ParseIntPipe) itemPerPage: number,
    @Query('sort', new DefaultValuePipe(SellerGoodsSortColumn.REGIST_DATE))
    sort: SellerGoodsSortColumn,
    @Query('direction', new DefaultValuePipe(SellerGoodsSortDirection.DESC))
    direction: SellerGoodsSortDirection,
    @Query('groupId') groupId?: number,
  ) {
    return this.goodsService.getGoodsList({
      email: seller.sub, // seller.email
      page,
      itemPerPage,
      sort,
      direction,
      groupId,
    });
  }

  /** 특정 상품 재고 조회 */
  @Get('/stock')
  getStockInfo(@Query('id', ParseIntPipe) id: number) {
    return this.goodsService.getStockInfo(id);
  }

  /** 특정 상품 노출 여부 변경 */
  @Patch('/expose')
  changeGoodsView(@Body(ValidationPipe) dto: ChangeGoodsViewDto) {
    const { id, view } = dto;
    return this.goodsService.changeGoodsView(id, view);
  }

  /** 공통정보 생성 */
  @Post('/common-info')
  registGoodsCommonInfo(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: GoodsInfoDto,
  ) {
    const email = seller.sub;
    return this.goodsService.registGoodsCommonInfo(email, dto);
  }

  /** 공통정보 삭제 */
  @Delete('/common-info')
  deleteCommonInfo(@Body('id', ParseIntPipe) id: number) {
    return this.goodsService.deleteGoodsCommonInfo(id);
  }

  /** 공통정보 목록 조회 */
  @Get('/common-info/list')
  getGoodsCommonInfoList(@SellerInfo() seller: UserPayload) {
    return this.goodsService.getGoodsCommonInfoList(seller.sub);
  }

  /** 특정 공통정보 상세 조회 */
  @Get('/common-info')
  getOneGoodsCommonInfo(@Query('id', ParseIntPipe) id: number) {
    return this.goodsService.getOneGoodsCommonInfo(id);
  }

  /** 특정 상품 삭제 */
  @Delete()
  async deleteGoods(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: DeleteGoodsDto,
  ) {
    const email = seller.sub;
    return this.goodsService.deleteLcGoods({
      email,
      ids: dto.ids,
    });
  }

  /** 상품 등록 */
  @Post()
  registGoods(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: RegistGoodsDto,
  ) {
    const email = seller.sub;
    return this.goodsService.registGoods(email, dto);
  }

  /** 상품 개별 조회 */
  @Get(':goodsId')
  getOneGoods(
    @SellerInfo() seller: UserPayload,
    @Param('goodsId') goodsId: string | number,
  ) {
    return this.goodsService.getOneGoods(goodsId, seller.sub);
  }
}
