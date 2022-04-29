import { Module, DynamicModule } from '@nestjs/common';
import { OrderCancellationController } from './order-cancellation/order-cancellation.controller';
import { OrderCancellationService } from './order-cancellation/order-cancellation.service';

@Module({})
export class OrderModule {
  private static readonly providers = [OrderCancellationService];
  private static readonly exports = [OrderCancellationService];
  private static readonly controllers = [OrderCancellationController];
  private static readonly imports = [];

  static withoutControllers(): DynamicModule {
    return {
      module: OrderModule,
      providers: this.providers,
      exports: this.exports,
      imports: this.imports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: OrderModule,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
      imports: this.imports,
    };
  }
}
