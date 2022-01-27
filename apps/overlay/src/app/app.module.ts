import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mailerConfig } from '@project-lc/nest-core';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { LiveShoppingModule } from '@project-lc/nest-modules-liveshopping';
import { CipherModule } from '@project-lc/nest-modules-cipher';
import { OverlayModule } from '@project-lc/nest-modules-overlay';
import { PrismaModule } from '@project-lc/prisma-orm';
import { validationSchema } from '../settings/config.validation';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppMessageGateway } from './app.message.gateway';
import { AppScreenGateway } from './app.screen.gateway';

@Module({
  imports: [
    CipherModule,
    PrismaModule,
    OverlayModule,
    LiveShoppingModule.withoutControllers(),
    BroadcasterModule.withoutControllers(),
    MailerModule.forRoot(mailerConfig),
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
  ],
  controllers: [AppController],
  providers: [AppGateway, AppScreenGateway, AppMessageGateway],
})
export class AppModule {}
