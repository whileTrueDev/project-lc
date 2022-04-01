import { DynamicModule, Module } from '@nestjs/common';
import { GoodsCommonInfoController } from './goods-common-info.controller';
import { GoodsCommonInfoService } from './goods-common-info.service';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';

@Module({})
export class GoodsModule {
  private static readonly providers = [GoodsService, GoodsCommonInfoService];
  private static readonly exports = [GoodsService, GoodsCommonInfoService];
  private static readonly controllers = [GoodsController, GoodsCommonInfoController];

  static withoutControllers(): DynamicModule {
    return {
      module: GoodsModule,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: GoodsModule,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
