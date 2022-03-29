import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { S3Module } from '@project-lc/nest-modules-s3';
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
    S3Module,
    ClientsModule.register([
      {
        name: 'MAILER_MQ',
        transport: Transport.REDIS,
        options: { url: 'redis://localhost:6399' },
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
