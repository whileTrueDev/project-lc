import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  providers: [AdminService, ConfigService],
  exports: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
