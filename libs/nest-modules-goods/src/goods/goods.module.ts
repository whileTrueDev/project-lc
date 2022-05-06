import { DynamicModule, Module } from '@nestjs/common';
import { GoodsCommonInfoController } from './goods-common-info.controller';
import { GoodsCommonInfoService } from './goods-common-info.service';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
import { GoodsInformationService } from './goods-information.service';
import { GoodsInformationController } from './goods-information.controller';

@Module({})
export class GoodsModule {
  private static readonly providers = [
    GoodsService,
    GoodsCommonInfoService,
    GoodsInformationService,
  ];

  private static readonly exports = [GoodsService, GoodsCommonInfoService];
  private static readonly controllers = [
    GoodsController,
    GoodsCommonInfoController,
    GoodsInformationController,
  ];

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
