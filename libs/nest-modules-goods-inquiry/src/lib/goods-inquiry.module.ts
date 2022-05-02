import { DynamicModule, Module } from '@nestjs/common';
import { GoodsInquiryController } from './goods-inquiry.controller';
import { GoodsInquiryService } from './goods-inquiry.service';

@Module({})
export class GoodsInquiryModule {
  private static readonly providers = [GoodsInquiryService];
  private static readonly exports = [GoodsInquiryService];
  private static readonly controllers = [GoodsInquiryController];

  static withoutControllers(): DynamicModule {
    return {
      module: GoodsInquiryModule,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: GoodsInquiryModule,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
