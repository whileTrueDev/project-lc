import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICE_OVERLAY_TOKEN, UserPwManager } from '@project-lc/nest-core';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { CipherModule } from '@project-lc/nest-modules-cipher';
import { CouponModule } from '@project-lc/nest-modules-coupon';
import { LiveShoppingModule } from '@project-lc/nest-modules-liveshopping';
import { MileageModule } from '@project-lc/nest-modules-mileage';
import { OrderCancellationController } from './order-cancellation/order-cancellation.controller';
import { OrderCancellationService } from './order-cancellation/order-cancellation.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderItemController } from './orderItem/orderItem.controller';
import { OrderItemService } from './orderItem/orderItem.service';
import { OrderItemOptionController } from './orderitemoption/orderitemoption.controller';
import { OrderItemOptionService } from './orderitemoption/orderitemoption.service';

@Module({})
export class OrderModule {
  private static readonly providers = [
    OrderService,
    UserPwManager,
    OrderCancellationService,
    OrderItemService,
    OrderItemOptionService,
  ];

  private static readonly exports = [
    OrderCancellationService,
    OrderService,
    OrderItemOptionService,
  ];

  private static readonly controllers = [
    OrderCancellationController,
    OrderController,
    OrderItemController,
    OrderItemOptionController,
  ];

  private static readonly imports = [
    ClientsModule.register([
      {
        name: MICROSERVICE_OVERLAY_TOKEN,
        transport: Transport.REDIS,
        options: { url: process.env.MQ_REDIS_URL || 'redis://localhost:6399' },
      },
    ]),
    BroadcasterModule.withoutControllers(),
    CouponModule.withoutControllers(),
    MileageModule.withoutControllers(),
    LiveShoppingModule.withoutControllers(),
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
