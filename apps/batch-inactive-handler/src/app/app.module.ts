import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { HttpModule } from '@nestjs/axios';
import { S3Module } from '@project-lc/nest-modules-s3';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { AppSellerService } from './app-seller.service';
import { AppBroadcasterService } from './app-broadcaster.service';
import { AppShutdownService } from './app-shutdown.service';
import { AppMailService } from './app-mail.service';
import { validationSchema } from '../settings/config.validation';

@Module({
  imports: [
    PrismaModule,
    S3Module,
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
  ],
  providers: [
    AppService,
    AppSellerService,
    AppBroadcasterService,
    AppShutdownService,
    AppMailService,
    ConfigService,
  ],
})
export class AppModule {}
