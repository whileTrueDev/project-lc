import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { BroadcasterModule } from '../broadcaster/broadcaster.module';
import { AdminSettlementService } from './admin-settlement.service';
import { OrderCancelModule } from '../order-cancel/order-cancel.module';

@Module({
  imports: [BroadcasterModule, OrderCancelModule],
  providers: [AdminService, ConfigService, AdminSettlementService],
  exports: [AdminService, AdminSettlementService],
  controllers: [AdminController],
})
export class AdminModule {}
