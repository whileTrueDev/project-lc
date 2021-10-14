import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { BroadcasterModule } from '../broadcaster/broadcaster.module';
@Module({
  imports: [BroadcasterModule],
  providers: [AdminService, ConfigService],
  exports: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
