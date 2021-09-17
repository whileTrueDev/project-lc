import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  providers: [AdminService, ConfigService],
  exports: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
