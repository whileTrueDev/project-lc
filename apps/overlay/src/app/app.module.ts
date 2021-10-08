import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BroadcasterModule, OverlayModule } from '@project-lc/nest-modules';
import { PrismaModule } from '@project-lc/prisma-orm';
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
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
  ],
  controllers: [AppController],
  providers: [AppGateway, AppScreenGateway, AppMessageGateway],
})
export class AppModule {}
