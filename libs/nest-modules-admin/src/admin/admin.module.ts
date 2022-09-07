import { DynamicModule, Module } from '@nestjs/common';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { CipherModule } from '@project-lc/nest-modules-cipher';
import { CouponModule } from '@project-lc/nest-modules-coupon';
import { CustomerModule } from '@project-lc/nest-modules-customer';
import { GoodsModule } from '@project-lc/nest-modules-goods';
import { GoodsCategoryModule } from '@project-lc/nest-modules-goods-category';
import {
  KkshowBcListModule,
  KkshowMainModule,
  KkshowShoppingModule,
} from '@project-lc/nest-modules-kkshow-main';
import { LiveShoppingModule } from '@project-lc/nest-modules-liveshopping';
import { ManualModule } from '@project-lc/nest-modules-manual';
import { MileageModule } from '@project-lc/nest-modules-mileage';
import { OrderModule } from '@project-lc/nest-modules-order';
import { OrderCancelModule } from '@project-lc/nest-modules-order-cancel';
import { OverlayThemeModule } from '@project-lc/nest-modules-overlay-controller';
import { PolicyModule } from '@project-lc/nest-modules-policy';
import { ProductPromotionModule } from '@project-lc/nest-modules-product-promotion';
import { ReturnModule } from '@project-lc/nest-modules-return';
import { SellerModule } from '@project-lc/nest-modules-seller';
import { AdminAccountService } from './admin-account.service';
import { AdminCouponController } from './admin-coupon.controller';
import { AdminCustomerCouponController } from './admin-customer-coupon.controller';
import { AdminCustomerController } from './admin-customer.controller';
import { AdminGoodsCategoryController } from './admin-goods-category.controller';
import { AdminKkshowMainController } from './admin-kkshow-main.controller';
import { AdminManualController } from './admin-manual.controller';
import { AdminMileageController } from './admin-mileage.controller';
import { AdminOrderController } from './admin-order.controller';
import { AdminOverlayThemeController } from './admin-overlay-theme.controller';
import { AdminPolicyController } from './admin-policy.controller';
import { AdminPrivacyApproachSevice } from './admin-privacy-approach.service';
import { AdminProductPromotionController } from './admin-product-promotion.controller';
import { AdminPromotionPageController } from './admin-promotion-page.controller';
import { AdminSettlementService } from './admin-settlement.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({})
export class AdminModule {
  private static readonly providers = [
    AdminService,
    AdminSettlementService,
    AdminAccountService,
    AdminPrivacyApproachSevice,
  ];

  private static readonly exports = [
    AdminService,
    AdminSettlementService,
    AdminAccountService,
  ];

  private static readonly controllers = [
    AdminController,
    AdminPolicyController,
    AdminPromotionPageController,
    AdminProductPromotionController,
    AdminKkshowMainController,
    AdminManualController,
    AdminGoodsCategoryController,
    AdminCustomerController,
    AdminMileageController,
    AdminCouponController,
    AdminCustomerCouponController,
    AdminOrderController,
    AdminOverlayThemeController,
  ];

  private static readonly imports = [
    ProductPromotionModule.withoutControllers(),
    OrderCancelModule.withoutControllers(),
    SellerModule.withoutControllers(),
    BroadcasterModule.withoutControllers(),
    GoodsModule.withoutControllers(),
    PolicyModule.withoutControllers(),
    KkshowMainModule.withoutControllers(),
    ManualModule.withoutControllers(),
    KkshowShoppingModule.withoutControllers(),
    KkshowBcListModule.withoutControllers(),
    GoodsCategoryModule.withoutControllers(),
    CustomerModule.withoutControllers(),
    MileageModule.withoutControllers(),
    CouponModule.withoutControllers(),
    LiveShoppingModule.withoutControllers(),
    OrderModule.withoutControllers(),
    ReturnModule.withoutControllers(),
    CipherModule,
    OverlayThemeModule.withoutControllers(),
  ];

  static withoutControllers(): DynamicModule {
    return {
      module: AdminModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: AdminModule,
      controllers: this.controllers,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
