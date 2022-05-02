import { DynamicModule, Module } from '@nestjs/common';
import { GoodsReviewController } from './goods-review.controller';
import { GoodsReviewService } from './goods-review.service';

@Module({})
export class GoodsReviewModule {
  private static readonly providers = [GoodsReviewService];
  private static readonly exports = [GoodsReviewService];
  private static readonly controllers = [GoodsReviewController];

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
