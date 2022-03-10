import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { S3Module } from '../lib/s3/s3.module';
import { AppSellerService } from './app-seller.service';
import { AppBroadcasterService } from './app-broadcaster.service';
import { AppShutdownService } from './app-shutdown.service';
import { AppMailService } from './app-mail.service';

@Module({
  imports: [PrismaModule, S3Module, HttpModule],
  providers: [
    AppService,
    AppSellerService,
    AppBroadcasterService,
    AppShutdownService,
    AppMailService,
  ],
})
export class AppModule {}
