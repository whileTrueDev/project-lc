import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { BroadcasterModule } from '../broadcaster/broadcaster.module';
import { AdminSettlementService } from './admin-settlement.service';
import { SellerModule } from '../..';

@Module({
  imports: [BroadcasterModule, SellerModule],
  providers: [AdminService, ConfigService, AdminSettlementService],
  exports: [AdminService, AdminSettlementService],
  controllers: [AdminController],
})
export class AdminModule {}
