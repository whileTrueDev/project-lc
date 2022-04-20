import { Module, DynamicModule } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({})
export class OrderModule {
  private static readonly providers = [OrderService];
  private static readonly exports = [];
  private static readonly controllers = [OrderController];

  static withoutControllers(): DynamicModule {
    return {
      module: OrderModule,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: OrderModule,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
