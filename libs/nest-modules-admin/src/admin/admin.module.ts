import { DynamicModule, Module } from '@nestjs/common';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { GoodsModule } from '@project-lc/nest-modules-goods';
import { KkshowMainModule } from '@project-lc/nest-modules-kkshow-main';
import { OrderCancelModule } from '@project-lc/nest-modules-order-cancel';
import { PolicyModule } from '@project-lc/nest-modules-policy';
import { ProductPromotionModule } from '@project-lc/nest-modules-product-promotion';
import { SellerModule } from '@project-lc/nest-modules-seller';
import { ManualModule } from '@project-lc/nest-modules-manual';
import { AdminAccountService } from './admin-account.service';
import { AdminKkshowMainController } from './admin-kkshow-main.controller';
import { AdminPolicyController } from './admin-policy.controller';
import { AdminProductPromotionController } from './admin-product-promotion.controller';
import { AdminPromotionPageController } from './admin-promotion-page.controller';
import { AdminSettlementService } from './admin-settlement.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminPrivacyApproachSevice } from './admin-privacy-approach.service';
import { AdminManualController } from './admin-manual.controller';

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
  ];

  private static readonly imports = [
    ProductPromotionModule,
    OrderCancelModule.withoutControllers(),
    SellerModule.withoutControllers(),
    BroadcasterModule.withoutControllers(),
    GoodsModule.withoutControllers(),
    PolicyModule,
    KkshowMainModule.withoutControllers(),
    ManualModule.withoutControllers(),
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
