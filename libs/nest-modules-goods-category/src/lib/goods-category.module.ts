import { Module, DynamicModule } from '@nestjs/common';
import { GoodsCategoryController } from './goods-category.controller';
import { GoodsCategoryService } from './goods-category.service';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class NestModulesGoodsCategoryModule {}

@Module({})
export class GoodsCategoryModule {
  private static readonly providers = [GoodsCategoryService];
  private static readonly exports = [GoodsCategoryService];
  private static readonly controllers = [GoodsCategoryController];

  static withoutControllers(): DynamicModule {
    return {
      module: GoodsCategoryModule,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: GoodsCategoryModule,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
