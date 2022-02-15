import { forwardRef, Module } from '@nestjs/common';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { GoodsModule } from '@project-lc/nest-modules-goods';
import { OrderCancelModule } from '@project-lc/nest-modules-order-cancel';
import { ProductPromotionModule } from '@project-lc/nest-modules-product-promotion';
import { SellerModule } from '@project-lc/nest-modules-seller';
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
  ],
  providers: [AdminService, AdminSettlementService, AdminAccountService],
  exports: [AdminService, AdminSettlementService, AdminAccountService],
  controllers: [AdminController],
})
export class AdminModule {}
