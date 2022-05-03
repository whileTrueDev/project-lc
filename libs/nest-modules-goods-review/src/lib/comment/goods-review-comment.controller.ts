import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { GoodsReview, GoodsReviewComment } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  GoodsReviewCommentCreateDto,
  GoodsReviewCommentRes,
  GoodsReviewCommentUpdateDto,
} from '@project-lc/shared-types';
import { GoodsReviewCommentService } from './goods-review-comment.service';

@Controller('goods-review/:reviewId/comment')
@UseInterceptors(HttpCacheInterceptor)
export class GoodsReviewCommentController {
  constructor(private readonly service: GoodsReviewCommentService) {}

  /** 특정 리뷰의 댓글 목록 조회 */
  @Get()
  findMany(
    @Param('reviewId', ParseIntPipe) reviewId: GoodsReview['id'],
  ): Promise<GoodsReviewCommentRes> {
    return this.service.findMany(reviewId);
  }

  /** 특정 리뷰에 댓글 생성 */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('reviewId', ParseIntPipe) reviewId: GoodsReview['id'],
    @Body(new ValidationPipe({ transform: true })) dto: GoodsReviewCommentCreateDto,
  ): Promise<GoodsReviewComment> {
    return this.service.create(reviewId, dto);
  }

  /** 특정 댓글 수정 */
  @UseGuards(JwtAuthGuard)
  @Patch(':commentId')
  update(
    @Param('commentId', ParseIntPipe) commentId: GoodsReviewComment['id'],
    @Body(new ValidationPipe({ transform: true })) dto: GoodsReviewCommentUpdateDto,
  ): Promise<GoodsReviewComment> {
    return this.service.update(commentId, dto);
  }

  /** 특정 댓글 삭제 */
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  remove(
    @Param('commentId', ParseIntPipe) commentId: GoodsReviewComment['id'],
  ): Promise<boolean> {
    return this.service.remove(commentId);
  }
}
