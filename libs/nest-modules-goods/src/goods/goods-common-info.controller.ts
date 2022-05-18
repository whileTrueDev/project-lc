import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { GoodsInfo } from '@prisma/client';
import {
  CacheClearKeys,
  HttpCacheInterceptor,
  SellerInfo,
  UserPayload,
} from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { GoodsInfoDto } from '@project-lc/shared-types';
import { GoodsCommonInfoService } from './goods-common-info.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('goods/common-info', 'goods')
@Controller('goods/common-info')
export class GoodsCommonInfoController {
  constructor(private readonly commonInfoService: GoodsCommonInfoService) {}

  /** 공통정보 목록 조회 */
  @Get('/list')
  getGoodsCommonInfoList(@SellerInfo() seller: UserPayload): Promise<
    {
      id: number;
      info_name: string;
    }[]
  > {
    return this.commonInfoService.getGoodsCommonInfoList(seller.id);
  }

  /** 특정 공통정보 상세 조회 */
  @Get('/detail')
  async getOneGoodsCommonInfo(@Query('id', ParseIntPipe) id: number): Promise<GoodsInfo> {
    return this.commonInfoService.getOneGoodsCommonInfo(id);
  }

  /** 공통정보 생성 */
  @Post()
  registGoodsCommonInfo(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: GoodsInfoDto,
  ): Promise<{ id: number }> {
    const sellerId = seller.id;
    return this.commonInfoService.registGoodsCommonInfo(sellerId, dto);
  }

  /** 공통정보 삭제  */
  @Delete()
  deleteCommonInfo(@Body('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.commonInfoService.deleteGoodsCommonInfo(id);
  }
}
