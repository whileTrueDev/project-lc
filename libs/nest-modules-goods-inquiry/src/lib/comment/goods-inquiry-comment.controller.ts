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
import { GoodsInquiry, GoodsInquiryComment } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { GoodsInquiryCommentDto } from '@project-lc/shared-types';
import { GoodsInquiryCommentService } from './goods-inquiry-comment.service';

@Controller('goods-inquiry/:goodsInquiryId/comment')
@UseInterceptors(HttpCacheInterceptor)
export class GoodsInquiryCommentController {
  constructor(private readonly service: GoodsInquiryCommentService) {}

  /** 특정 문의의 상품 문의 답변 목록 조회 */
  @Get()
  findAll(
    @Param('goodsInquiryId', ParseIntPipe) id: GoodsInquiry['id'],
  ): Promise<GoodsInquiryComment[]> {
    return this.service.findAll(id);
  }

  /** 특정 문의의 상품 문의 답변 생성 */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('goodsInquiryId', ParseIntPipe) id: GoodsInquiry['id'],
    @Body(new ValidationPipe({ transform: true })) dto: GoodsInquiryCommentDto,
  ): Promise<GoodsInquiryComment> {
    return this.service.create(id, dto);
  }

  /** 특정 상품 문의 답변 수정 */
  @UseGuards(JwtAuthGuard)
  @Patch(':commentId')
  update(
    @Param('commentId', ParseIntPipe) commentId: GoodsInquiryComment['id'],
    @Body(new ValidationPipe({ transform: true })) dto: GoodsInquiryCommentDto,
  ): Promise<GoodsInquiryComment> {
    return this.service.update(commentId, dto);
  }

  /** 특정 상품 문의 답변 삭제 */
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  remove(
    @Param('commentId', ParseIntPipe) commentId: GoodsInquiryComment['id'],
  ): Promise<boolean> {
    return this.service.remove(commentId);
  }
}
