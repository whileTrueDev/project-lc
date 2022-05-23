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
  DeleteGoodsDto,
  GoodsByIdRes,
  GoodsImageDto,
  GoodsListRes,
  GoodsOptionWithStockInfo,
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

  /** 상품 이미지 생성 */
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

  /** 상품 목록 조회 - 본인 판매상품만 확인가능 */
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
    @Body(ValidationPipe) dto: RegistGoodsDto,
  ): Promise<{ goodsId: number }> {
    return this.goodsService.registGoods(seller.id, dto);
  }

  @Get('all-ids')
  getAllGoodsIds(): Promise<AllGoodsIdsRes> {
    return this.goodsService.findAllGoodsIds();
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
