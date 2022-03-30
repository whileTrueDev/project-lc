import { DynamicModule, Module } from '@nestjs/common';
import { KkshowShoppingService } from './kkshow-shopping.service';
import { KkshowShoppingController } from './kkshow-shopping.controller';

@Module({})
export class KkshowShoppingModule {
  private static readonly providers = [KkshowShoppingService];

  private static readonly exports = [KkshowShoppingService];

  private static readonly controllers = [KkshowShoppingController];

  static withoutControllers(): DynamicModule {
    return {
      module: KkshowShoppingModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: KkshowShoppingModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
      controllers: this.controllers,
    };
  }
}
