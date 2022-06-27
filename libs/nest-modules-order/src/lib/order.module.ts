import { DynamicModule, Module } from '@nestjs/common';
import { UserPwManager } from '@project-lc/nest-core';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { CipherModule } from '@project-lc/nest-modules-cipher';
import { CouponModule } from '@project-lc/nest-modules-coupon';
import { MileageModule } from '@project-lc/nest-modules-mileage';
import { OrderCancellationController } from './order-cancellation/order-cancellation.controller';
import { OrderCancellationService } from './order-cancellation/order-cancellation.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderItemController } from './orderItem/orderItem.controller';
import { OrderItemService } from './orderItem/orderItem.service';

@Module({})
export class OrderModule {
  private static readonly providers = [
    OrderService,
    UserPwManager,
    OrderCancellationService,
    OrderItemService,
  ];

  private static readonly exports = [OrderCancellationService, OrderService];
  private static readonly controllers = [
    OrderCancellationController,
    OrderController,
    OrderItemController,
  ];

  private static readonly imports = [
    BroadcasterModule.withoutControllers(),
    CouponModule.withoutControllers(),
    MileageModule.withoutControllers(),
    CipherModule,
  ];

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
