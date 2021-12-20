import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BroadcasterModule, OverlayModule, mailerConfig } from '@project-lc/nest-modules';
import { PrismaModule } from '@project-lc/prisma-orm';
import { MailerModule } from '@nestjs-modules/mailer';
import { validationSchema } from '../settings/config.validation';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppMessageGateway } from './app.message.gateway';
import { AppScreenGateway } from './app.screen.gateway';
@Module({
  imports: [
    PrismaModule,
    OverlayModule,
    BroadcasterModule,
    MailerModule.forRoot(mailerConfig),
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
  ],
  controllers: [AppController],
  providers: [AppGateway, AppScreenGateway, AppMessageGateway],
})
export class AppModule {}
