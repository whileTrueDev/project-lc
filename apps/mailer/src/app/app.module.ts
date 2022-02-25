import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { MailModule } from '../lib/mail/mail.module';
import { AppService } from './app.service';
import { S3Module } from '../lib/s3/s3.module';
import { AppSellerService } from './app-seller.service';
import { AppBroadcasterService } from './app-broadcaster.service';
import { AppShutdownService } from './app-shutdown.service';
@Module({
  imports: [PrismaModule, MailModule, S3Module],
  providers: [AppService, AppSellerService, AppBroadcasterService, AppShutdownService],
})
export class AppModule {}
