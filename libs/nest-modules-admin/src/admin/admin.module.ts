import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { SellerModule } from '@project-lc/nest-modules-seller';
import { OrderCancelModule } from '@project-lc/nest-modules-order-cancel';
import { AdminAccountService } from './admin-account.service';
import { AdminSettlementService } from './admin-settlement.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    forwardRef(() => SellerModule),
    forwardRef(() => BroadcasterModule.withoutControllers()),
    OrderCancelModule,
  ],
  providers: [AdminService, ConfigService, AdminSettlementService, AdminAccountService],
  exports: [AdminService, AdminSettlementService, AdminAccountService],
  controllers: [AdminController],
})
export class AdminModule {}
