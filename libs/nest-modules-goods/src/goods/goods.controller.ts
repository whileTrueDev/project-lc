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
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { GoodsImages } from '@prisma/client';
import {
  CacheClearKeys,
  HttpCacheInterceptor,
  SellerInfo,
  UserPayload,
} from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  AllGoodsIdsRes,
  ChangeGoodsViewDto,
  DefaultPaginationDto,
  DeleteGoodsDto,
  GoodsByIdRes,
  GoodsImageDto,
  GoodsListRes,
  GoodsOptionWithStockInfo,
  GoodsOutlineByIdPaginationRes,
  GoodsOutlineByIdRes,
  RegistGoodsDto,
  SellerGoodsSortColumn,
  SellerGoodsSortDirection,
} from '@project-lc/shared-types';
import { GoodsService } from './goods.service';

@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('goods')
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  /** 상품 목록 조회 - 특정 판매자 검색 가능 */
  @Get()
  getGoodsListWithExtraFeatures(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('itemPerPage', new DefaultValuePipe(10), ParseIntPipe) itemPerPage: number,
    @Query('sort', new DefaultValuePipe(SellerGoodsSortColumn.REGIST_DATE))
    sort: SellerGoodsSortColumn,
    @Query('direction', new DefaultValuePipe(SellerGoodsSortDirection.DESC))
    direction: SellerGoodsSortDirection,
    @Query('groupId') groupId?: number,
    @Query('goodsName') goodsName?: string,
    @Query('categoryId') categoryId?: number,
    @Query('sellerId') sellerId?: string,
  ): Promise<GoodsListRes> {
    return this.goodsService.getGoodsList({
      sellerId: sellerId ? Number(sellerId) : undefined,
      page,
      itemPerPage,
      sort,
      direction,
      groupId: groupId ? Number(groupId) : undefined,
      goodsName: goodsName || undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
    });
  }

  /** 상품 이미지 생성 - s3에 저장된 이미지 url을 저장함 */
  @Post('/image')
  @UseGuards(JwtAuthGuard)
  registGoodsImages(@Body(ValidationPipe) dto: GoodsImageDto[]): Promise<GoodsImages[]> {
    return this.goodsService.registGoodsImages(dto);
  }

  /** 상품 이미지 삭제 */
  @Delete('/image')
  @UseGuards(JwtAuthGuard)
  deleteGoodsImage(@Body('imageId', ParseIntPipe) imageId: number): Promise<boolean> {
    return this.goodsService.deleteGoodsImage(imageId);
  }

  /** 여러 상품 이미지 데이터 수정 */
  @Patch('/image')
  @UseGuards(JwtAuthGuard)
  updateGoodsImages(@Body(ValidationPipe) dto: GoodsImageDto[]): Promise<boolean> {
    return this.goodsService.updateGoodsImages(dto);
  }

  /** 상품 목록 조회 - 본인 판매상품만 확인가능(@SellerInfo 데코레이터 사용으로 판매자로 로그인했을때만 사용가능) */
  @Get('/list')
  @UseGuards(JwtAuthGuard)
  getGoodsList(
    @SellerInfo() seller: UserPayload,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('itemPerPage', new DefaultValuePipe(10), ParseIntPipe) itemPerPage: number,
    @Query('sort', new DefaultValuePipe(SellerGoodsSortColumn.REGIST_DATE))
    sort: SellerGoodsSortColumn,
    @Query('direction', new DefaultValuePipe(SellerGoodsSortDirection.DESC))
    direction: SellerGoodsSortDirection,
    @Query('groupId') groupId?: number,
  ): Promise<GoodsListRes> {
    return this.goodsService.getGoodsList({
      sellerId: seller.id,
      page,
      itemPerPage,
      sort,
      direction,
      groupId: groupId ? Number(groupId) : undefined,
    });
  }

  /** 특정 상품 재고 조회 */
  @Get('/stock')
  @UseGuards(JwtAuthGuard)
  getStockInfo(
    @Query('id', ParseIntPipe) id: number,
  ): Promise<GoodsOptionWithStockInfo[]> {
    return this.goodsService.getStockInfo(id);
  }

  /** 특정 상품 노출 여부 변경 */
  @Patch('/expose')
  @UseGuards(JwtAuthGuard)
  changeGoodsView(@Body(ValidationPipe) dto: ChangeGoodsViewDto): Promise<boolean> {
    const { id, view } = dto;
    return this.goodsService.changeGoodsView(id, view);
  }

  /** 특정 상품 삭제 */
  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteGoods(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: DeleteGoodsDto,
  ): Promise<boolean> {
    const sellerId = seller.id;
    return this.goodsService.deleteLcGoods({
      sellerId,
      ids: dto.ids,
    });
  }

  /** 상품 등록 */
  @Post()
  @UseGuards(JwtAuthGuard)
  registGoods(
    @SellerInfo() seller: UserPayload,
    @Body(new ValidationPipe({ transform: true })) dto: RegistGoodsDto,
  ): Promise<{ goodsId: number }> {
    return this.goodsService.registGoods(seller.id, dto);
  }

  /** 검수 승인된 모든 상품의 고유번호 조회(상품 노출여부 상관없음) */
  @Get('all-ids')
  getAllGoodsIds(): Promise<AllGoodsIdsRes> {
    return this.goodsService.findAllGoodsIds();
  }

  /** 카테고리코드 기준으로 상품 간략 정보 목록 조회 */
  @Get('by-category/:categoryCode')
  getGoodsByCategory(
    @Param('categoryCode') categoryCode: string,
    @Query(new ValidationPipe({ transform: true })) dto?: DefaultPaginationDto,
  ): Promise<GoodsOutlineByIdPaginationRes> {
    return this.goodsService.getGoodsOutlineByCategory(categoryCode, dto);
  }

  /** 상품 개별 조회 */
  @Get(':goodsId')
  getOneGoods(@Param('goodsId', ParseIntPipe) goodsId: number): Promise<GoodsByIdRes> {
    return this.goodsService.getOneGoods(goodsId);
  }

  /** 상품 개별 조회 (반환 데이터가 간략함) */
  @Get(':goodsId/outline')
  getOneGoodsOutline(
    @Param('goodsId', ParseIntPipe) goodsId: number,
  ): Promise<GoodsOutlineByIdRes> {
    return this.goodsService.getOneGoodsOutline(goodsId);
  }

  /** 상품 수정 */
  @Put(':goodsId')
  @UseGuards(JwtAuthGuard)
  updateOneGoods(
    @Param('goodsId', ParseIntPipe) goodsId: number,
    @Body(ValidationPipe) dto: RegistGoodsDto,
  ): Promise<{ goodsId: number }> {
    return this.goodsService.updateOneGoods(goodsId, dto);
  }
}
