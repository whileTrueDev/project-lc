import { DynamicModule, Module } from '@nestjs/common';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { ProductPromotionController } from './product-promotion.controller';
import { ProductPromotionService } from './product-promotion.service';

@Module({})
export class ProductPromotionModule {
  private static readonly imports = [BroadcasterModule.withoutControllers()];
  private static readonly providers = [ProductPromotionService];
  private static readonly exports = [ProductPromotionService];
  private static readonly controllers = [ProductPromotionController];

  static withoutControllers(): DynamicModule {
    return {
      module: ProductPromotionModule,
      providers: this.providers,
      exports: this.exports,
      imports: this.imports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: ProductPromotionModule,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
      imports: this.imports,
    };
  }
}
