import { DynamicModule, Module } from '@nestjs/common';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { CustomerModule } from '@project-lc/nest-modules-customer';
import { GoodsModule } from '@project-lc/nest-modules-goods';
import {
  KkshowMainModule,
  KkshowShoppingModule,
} from '@project-lc/nest-modules-kkshow-main';
import { ManualModule } from '@project-lc/nest-modules-manual';
import { OrderCancelModule } from '@project-lc/nest-modules-order-cancel';
import { PolicyModule } from '@project-lc/nest-modules-policy';
import { ProductPromotionModule } from '@project-lc/nest-modules-product-promotion';
import { SellerModule } from '@project-lc/nest-modules-seller';
import { GoodsCategoryModule } from '@project-lc/nest-modules-goods-category';
import { AdminAccountService } from './admin-account.service';
import { AdminCustomerController } from './admin-customer.controller';
import { AdminKkshowMainController } from './admin-kkshow-main.controller';
import { AdminManualController } from './admin-manual.controller';
import { AdminPolicyController } from './admin-policy.controller';
import { AdminPrivacyApproachSevice } from './admin-privacy-approach.service';
import { AdminProductPromotionController } from './admin-product-promotion.controller';
import { AdminPromotionPageController } from './admin-promotion-page.controller';
import { AdminSettlementService } from './admin-settlement.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminGoodsCategoryController } from './admin-goods-category.controller';

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
  ];

  private static readonly imports = [
    ProductPromotionModule,
    OrderCancelModule.withoutControllers(),
    SellerModule.withoutControllers(),
    BroadcasterModule.withoutControllers(),
    GoodsModule.withoutControllers(),
    PolicyModule.withoutControllers(),
    KkshowMainModule.withoutControllers(),
    ManualModule.withoutControllers(),
    KkshowShoppingModule.withoutControllers(),
    GoodsCategoryModule.withoutControllers(),
    CustomerModule.withoutControllers(),
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
