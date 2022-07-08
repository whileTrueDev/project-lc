import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { GoodsReviewImage } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { GoodsReviewImageUpdateDto } from '@project-lc/shared-types';
import { GoodsReviewImageService } from './goods-review-image.service';
// import { GoodsReviewService } from './goods-review.service';

@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('goods-review')
@Controller('goods-review-image')
export class GoodsReviewImageController {
  constructor(private readonly service: GoodsReviewImageService) {}

  /** 리뷰 이미지 식제 */
  @UseGuards(JwtAuthGuard)
  @Delete(':reviewImageId')
  remove(
    @Param('reviewImageId', ParseIntPipe) id: GoodsReviewImage['id'],
  ): Promise<boolean> {
    return this.service.remove(id);
  }

  @Delete()
  removeByImageUrl(
    @Query(ValidationPipe) dto: GoodsReviewImageUpdateDto,
  ): Promise<boolean> {
    return this.service.removeByImageUrl(dto.imageUrl);
  }
}
