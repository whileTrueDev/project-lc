import { DynamicModule, Module } from '@nestjs/common';
import { GoodsCategoryModule } from '@project-lc/nest-modules-goods-category';
import { KkshowShoppingService } from './kkshow-shopping.service';
import { KkshowShoppingController } from './kkshow-shopping.controller';

@Module({})
export class KkshowShoppingModule {
  private static readonly providers = [KkshowShoppingService];

  private static readonly exports = [KkshowShoppingService];

  private static readonly controllers = [KkshowShoppingController];

  private static readonly imports = [GoodsCategoryModule.withoutControllers()];

  static withoutControllers(): DynamicModule {
    return {
      module: KkshowShoppingModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: KkshowShoppingModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
      controllers: this.controllers,
    };
  }
}
