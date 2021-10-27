import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SellerModule } from '../..';
import { BroadcasterModule } from '../broadcaster/broadcaster.module';
import { OrderCancelModule } from '../order-cancel/order-cancel.module';
import { AdminSettlementService } from './admin-settlement.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [BroadcasterModule, SellerModule, OrderCancelModule],
  providers: [AdminService, ConfigService, AdminSettlementService],
  exports: [AdminService, AdminSettlementService],
  controllers: [AdminController],
})
export class AdminModule {}
