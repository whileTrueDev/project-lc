import { DynamicModule, Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({})
export class CartModule {
  private static readonly providers = [CartService];

  private static readonly exports = [CartService];

  private static readonly controllers = [CartController];

  private static readonly imports = [];

  static withoutControllers(): DynamicModule {
    return {
      module: CartModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: CartModule,
      controllers: this.controllers,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
