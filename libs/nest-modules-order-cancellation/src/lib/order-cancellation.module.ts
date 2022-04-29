import { DynamicModule, Module } from '@nestjs/common';
import { OrderCancellationService } from './order-cancellation.service';
import { OrderCancellationController } from './order-cancellation.controller';

@Module({})
export class OrderCancellationModule {
  private static readonly providers = [OrderCancellationService];

  private static readonly exports = [OrderCancellationService];

  private static readonly controllers = [OrderCancellationController];
  static withoutControllers(): DynamicModule {
    return {
      module: OrderCancellationModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: OrderCancellationModule,
      controllers: this.controllers,
      imports: [],
      providers: this.providers,
      exports: this.exports,
    };
  }
}
