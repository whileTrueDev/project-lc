import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICE_MAILER_TOKEN } from '@project-lc/nest-core';
import { PrismaModule } from '@project-lc/prisma-orm';
import { validationSchema } from '../settings/config.validation';
import { AppBroadcasterService } from './app-broadcaster.service';
import { AppMailService } from './app-mail.service';
import { AppSellerService } from './app-seller.service';
import { AppShutdownService } from './app-shutdown.service';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: MICROSERVICE_MAILER_TOKEN,
        transport: Transport.REDIS,
        options: { url: process.env.MQ_REDIS_URL || 'redis://localhost:6399' },
      },
    ]),
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
