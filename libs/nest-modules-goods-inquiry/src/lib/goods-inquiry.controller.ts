import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { GoodsInquiry } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import {
  FindGoodsInquiryItem,
  FindGoodsInquiryRes,
  GoodsInquiryCreateDto,
  GoodsInquiryUpdateDto,
} from '@project-lc/shared-types';
import { GoodsInquiryService } from './goods-inquiry.service';

@Controller('goods-inquiry')
@UseInterceptors(HttpCacheInterceptor)
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
  findMany(): Promise<FindGoodsInquiryRes> {
    return this.goodsInquiryService.findMany();
  }

  /** 상품문의 생성 */
  @Post()
  create(
    @Body(new ValidationPipe({ transform: true })) dto: GoodsInquiryCreateDto,
  ): Promise<GoodsInquiry> {
    return this.goodsInquiryService.create(dto);
  }

  /** 특정 상품문의 수정 */
  @Patch(':goodsInquiryId')
  update(
    @Param('goodsInquiryId', ParseIntPipe) id: GoodsInquiry['id'],
    @Body(new ValidationPipe({ transform: true })) dto: GoodsInquiryUpdateDto,
  ): Promise<GoodsInquiry> {
    return this.goodsInquiryService.update(id, dto);
  }

  /** 특정 상품문의 삭제 */
  @Delete(':goodsInquiryId')
  remove(
    @Param('goodsInquiryId', ParseIntPipe) id: GoodsInquiry['id'],
  ): Promise<boolean> {
    return this.goodsInquiryService.remove(id);
  }
}
