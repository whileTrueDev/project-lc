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
import { Goods, GoodsReview } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  FindManyGoodsReviewDto,
  GoodsReviewCreateDto,
  GoodsReviewItem,
  GoodsReviewRes,
  GoodsReviewUpdateDto,
} from '@project-lc/shared-types';
import { GoodsReviewService } from './goods-review.service';

@Controller('goods-review')
@UseInterceptors(HttpCacheInterceptor)
export class GoodsReviewController {
  constructor(private readonly service: GoodsReviewService) {}

  @Get('count')
  getCount(@Query('goodsId', ParseIntPipe) goodsId: Goods['id']): Promise<number> {
    return this.service.getCount(goodsId);
  }

  /** 개별 리뷰 조회 */
  @Get(':reviewId')
  findOne(
    @Param('reviewId', ParseIntPipe) id: GoodsReview['id'],
  ): Promise<GoodsReviewItem> {
    return this.service.findOne(id);
  }

  /** 리뷰 목록 조회 */
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) dto: FindManyGoodsReviewDto,
  ): Promise<GoodsReviewRes> {
    const { goodsId, customerId, sellerId, skip, take } = dto;
    return this.service.findMany(
      { goodsId, writerId: customerId, goods: { sellerId } },
      { skip, take },
    );
  }

  /** 리뷰 생성 */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(new ValidationPipe({ transform: true })) dto: GoodsReviewCreateDto,
  ): Promise<GoodsReview> {
    return this.service.create(dto);
  }

  /** 리뷰 수정 */
  @UseGuards(JwtAuthGuard)
  @Patch(':reviewId')
  update(
    @Param('reviewId', ParseIntPipe) id: GoodsReview['id'],
    @Body(new ValidationPipe({ transform: true })) dto: GoodsReviewUpdateDto,
  ): Promise<GoodsReview> {
    return this.service.update(id, dto);
  }

  /** 리뷰 식제 */
  @UseGuards(JwtAuthGuard)
  @Delete(':reviewId')
  remove(@Param('reviewId', ParseIntPipe) id: GoodsReview['id']): Promise<boolean> {
    return this.service.remove(id);
  }
}
