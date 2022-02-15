import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { SellerModule } from '@project-lc/nest-modules-seller';
import { OrderCancelModule } from '@project-lc/nest-modules-order-cancel';
import { ProductPromotionModule } from '@project-lc/nest-modules-product-promotion';
import { GoodsModule } from '@project-lc/nest-modules-goods';
import { PolicyModule } from '@project-lc/nest-modules-policy';
import { AdminAccountService } from './admin-account.service';
import { AdminSettlementService } from './admin-settlement.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    forwardRef(() => SellerModule.withoutControllers()),
    forwardRef(() => BroadcasterModule.withoutControllers()),
    OrderCancelModule,
    ProductPromotionModule,
    GoodsModule.withoutControllers(),
    PolicyModule,
  ],
  providers: [AdminService, ConfigService, AdminSettlementService, AdminAccountService],
  exports: [AdminService, AdminSettlementService, AdminAccountService],
  controllers: [AdminController],
})
export class AdminModule {}
