import { Module, DynamicModule } from '@nestjs/common';
import { CustomerModule } from '@project-lc/nest-modules-customer';
import { GoodsModule } from '@project-lc/nest-modules-goods';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { CustomerCouponService } from './customer-coupon.service';
import { CouponLogService } from './coupon-log.service';

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

  private static readonly imports = [CustomerModule, GoodsModule.withoutControllers()];

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
