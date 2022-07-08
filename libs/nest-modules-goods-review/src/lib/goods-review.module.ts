import { DynamicModule, Module } from '@nestjs/common';
import { GoodsReviewCommentController } from './comment/goods-review-comment.controller';
import { GoodsReviewCommentService } from './comment/goods-review-comment.service';
import { GoodsReviewImageController } from './goods-review-image.controller';
import { GoodsReviewImageService } from './goods-review-image.service';
import { GoodsReviewController } from './goods-review.controller';
import { GoodsReviewService } from './goods-review.service';

@Module({})
export class GoodsReviewModule {
  private static readonly providers = [
    GoodsReviewService,
    GoodsReviewCommentService,
    GoodsReviewImageService,
  ];

  private static readonly exports = [
    GoodsReviewService,
    GoodsReviewCommentService,
    GoodsReviewImageService,
  ];

  private static readonly controllers = [
    GoodsReviewImageController,
    GoodsReviewController,
    GoodsReviewCommentController,
  ];

  static withoutControllers(): DynamicModule {
    return {
      module: GoodsReviewModule,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: GoodsReviewModule,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
