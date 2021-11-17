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
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { GoodsImages, GoodsInfo } from '@prisma/client';
import {
  ChangeGoodsViewDto,
  DeleteGoodsDto,
  GoodsByIdRes,
  GoodsImageDto,
  GoodsInfoDto,
  GoodsListRes,
  GoodsOptionWithStockInfo,
  RegistGoodsDto,
  SellerGoodsSortColumn,
  SellerGoodsSortDirection,
} from '@project-lc/shared-types';
import { FileInterceptor } from '@nestjs/platform-express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import multer from 'multer';
import { UserPayload } from '../auth/auth.interface';
import { GoodsInfoService } from '../goods-info/goods-info.service';
import { SellerInfo } from '../_nest-units/decorators/sellerInfo.decorator';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
import { GoodsService } from './goods.service';

@UseGuards(JwtAuthGuard)
@Controller('goods')
export class GoodsController {
  constructor(
    private readonly goodsService: GoodsService,
    private readonly commonInfoService: GoodsInfoService,
  ) {}

  /** 테스트 - 셀러 아바타 추가 - 셀러 컨트롤러로 옮겨야함 */
  @Post('/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @SellerInfo() seller: UserPayload,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    console.log('avatar router', file);
    return this.goodsService.testAddAvatar(seller.sub, file.buffer, file.originalname);
  }

  /** 상품 이미지 생성 */
  @Post('/image')
  registGoodsImages(@Body(ValidationPipe) dto: GoodsImageDto[]): Promise<GoodsImages[]> {
    return this.goodsService.registGoodsImages(dto);
  }

  /** 상품 이미지 삭제 */
  @Delete('/image')
  deleteGoodsImage(@Body('imageId', ParseIntPipe) imageId: number): Promise<boolean> {
    return this.goodsService.deleteGoodsImage(imageId);
  }

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
  ): Promise<GoodsListRes> {
    return this.goodsService.getGoodsList({
      email: seller.sub, // seller.email
      page,
      itemPerPage,
      sort,
      direction,
      groupId: groupId ? Number(groupId) : undefined,
    });
  }

  /** 특정 상품 재고 조회 */
  @Get('/stock')
  getStockInfo(
    @Query('id', ParseIntPipe) id: number,
  ): Promise<GoodsOptionWithStockInfo[]> {
    return this.goodsService.getStockInfo(id);
  }

  /** 특정 상품 노출 여부 변경 */
  @Patch('/expose')
  changeGoodsView(@Body(ValidationPipe) dto: ChangeGoodsViewDto): Promise<boolean> {
    const { id, view } = dto;
    return this.goodsService.changeGoodsView(id, view);
  }

  /** 공통정보 생성 */
  @Post('/common-info')
  registGoodsCommonInfo(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: GoodsInfoDto,
  ): Promise<{ id: number }> {
    const email = seller.sub;
    return this.commonInfoService.registGoodsCommonInfo(email, dto);
  }

  /** 공통정보 삭제  */
  @Delete('/common-info')
  deleteCommonInfo(@Body('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.commonInfoService.deleteGoodsCommonInfo(id);
  }

  /** 공통정보 목록 조회 */
  @Get('/common-info/list')
  getGoodsCommonInfoList(@SellerInfo() seller: UserPayload): Promise<
    {
      id: number;
      info_name: string;
    }[]
  > {
    return this.commonInfoService.getGoodsCommonInfoList(seller.sub);
  }

  /** 특정 공통정보 상세 조회 */
  @Get('/common-info')
  getOneGoodsCommonInfo(@Query('id', ParseIntPipe) id: number): Promise<GoodsInfo> {
    return this.commonInfoService.getOneGoodsCommonInfo(id);
  }

  /** 특정 상품 삭제 */
  @Delete()
  async deleteGoods(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: DeleteGoodsDto,
  ): Promise<boolean> {
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
  ): Promise<{ goodsId: number }> {
    const email = seller.sub;
    return this.goodsService.registGoods(email, dto);
  }

  /** 상품 개별 조회 */
  @Get(':goodsId')
  getOneGoods(
    @SellerInfo() seller: UserPayload,
    @Param('goodsId', ParseIntPipe) goodsId: number,
  ): Promise<GoodsByIdRes> {
    return this.goodsService.getOneGoods(goodsId, seller.sub);
  }

  /** 상품 수정 */
  @Put(':goodsId')
  updateOneGoods(
    @Param('goodsId', ParseIntPipe) goodsId: number,
    @Body(ValidationPipe) dto: RegistGoodsDto,
  ): Promise<{ goodsId: number }> {
    return this.goodsService.updateOneGoods(goodsId, dto);
  }
}
