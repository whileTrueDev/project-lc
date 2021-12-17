import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SellerModule } from '../seller/seller.module';
import { BroadcasterModule } from '../broadcaster/broadcaster.module';
import { OrderCancelModule } from '../order-cancel/order-cancel.module';
import { AdminSettlementService } from './admin-settlement.service';
import { AdminAccountService } from './admin-account.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [BroadcasterModule, SellerModule, OrderCancelModule],
  providers: [AdminService, ConfigService, AdminSettlementService, AdminAccountService],
  exports: [AdminService, AdminSettlementService, AdminAccountService],
  controllers: [AdminController],
})
export class AdminModule {}
