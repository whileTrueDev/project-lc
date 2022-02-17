import { DynamicModule, Module } from '@nestjs/common';
import { OrderCancelController } from './order-cancel.controller';
import { OrderCancelService } from './order-cancel.service';

@Module({})
export class OrderCancelModule {
  private static readonly providers = [OrderCancelService];

  private static readonly exports = [OrderCancelService];

  private static readonly controllers = [OrderCancelController];
  static withoutControllers(): DynamicModule {
    return {
      module: OrderCancelModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: OrderCancelModule,
      controllers: this.controllers,
      imports: [],
      providers: this.providers,
      exports: this.exports,
    };
  }
}
