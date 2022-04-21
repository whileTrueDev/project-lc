import { Module, DynamicModule } from '@nestjs/common';
import { UserPwManager } from '@project-lc/nest-core';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({})
export class OrderModule {
  private static readonly providers = [OrderService, UserPwManager];
  private static readonly exports = [];
  private static readonly controllers = [OrderController];
  private static readonly imports = [BroadcasterModule.withoutControllers()];

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
