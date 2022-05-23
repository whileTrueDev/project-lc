import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { GoodsInquiry } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  FindGoodsInquiryItem,
  FindManyGoodsInquiryDto,
  GoodsInquiryCreateDto,
  GoodsInquiryUpdateDto,
  PaginatedGoodsInquiryRes,
} from '@project-lc/shared-types';
import { GoodsInquiryService } from './goods-inquiry.service';

@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('goods-inquiry')
@Controller('goods-inquiry')
export class GoodsInquiryController {
  constructor(private readonly goodsInquiryService: GoodsInquiryService) {}

  /** 상품문의 개별 조회 */
  @Get(':goodsInquiryId')
  findOne(
    @Param('goodsInquiryId', ParseIntPipe) id: GoodsInquiry['id'],
  ): Promise<FindGoodsInquiryItem> {
    return this.goodsInquiryService.findOne(id);
  }

  /** 상품문의 전체 목록 조회 */
  @Get()
  findMany(
    @Query(new ValidationPipe({ transform: true })) dto: FindManyGoodsInquiryDto,
  ): Promise<PaginatedGoodsInquiryRes> {
    const { goodsId, customerId, sellerId, skip, take } = dto;
    return this.goodsInquiryService.findMany(
      { goodsId, writerId: customerId, goods: { sellerId } },
      { skip, take },
    );
  }

  /** 상품문의 생성 */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(new ValidationPipe({ transform: true })) dto: GoodsInquiryCreateDto,
  ): Promise<GoodsInquiry> {
    return this.goodsInquiryService.create(dto);
  }

  /** 특정 상품문의 수정 */
  @UseGuards(JwtAuthGuard)
  @Patch(':goodsInquiryId')
  async update(
    @Param('goodsInquiryId', ParseIntPipe) id: GoodsInquiry['id'],
    @Body(new ValidationPipe({ transform: true })) dto: GoodsInquiryUpdateDto,
  ): Promise<GoodsInquiry> {
    return this.goodsInquiryService.update(id, dto);
  }

  /** 특정 상품문의 삭제 */
  @UseGuards(JwtAuthGuard)
  @Delete(':goodsInquiryId')
  async remove(
    @Param('goodsInquiryId', ParseIntPipe) id: GoodsInquiry['id'],
  ): Promise<boolean> {
    return this.goodsInquiryService.remove(id);
  }
}
