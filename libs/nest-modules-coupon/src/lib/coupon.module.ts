import { DynamicModule, Module } from '@nestjs/common';
import { GoodsModule } from '@project-lc/nest-modules-goods';
import { CouponLogService } from './coupon-log.service';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CustomerCouponService } from './customer-coupon.service';

@Module({})
export class CouponModule {
  private static readonly providers = [
    CouponService,
    CustomerCouponService,
    CouponLogService,
  ];

  private static readonly exports = [
    CouponService,
    CustomerCouponService,
    CouponLogService,
  ];

  private static readonly controllers = [CouponController];

  private static readonly imports = [GoodsModule.withoutControllers()];

  static withoutControllers(): DynamicModule {
    return {
      module: CouponModule,
      providers: this.providers,
      exports: this.exports,
      imports: this.imports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: CouponModule,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
      imports: this.imports,
    };
  }
}
