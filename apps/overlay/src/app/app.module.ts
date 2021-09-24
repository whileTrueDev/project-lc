import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { OverlayService, OverlayModule } from '@project-lc/nest-modules';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppScreenGateway } from './app.screen.gateway';
import { AppMessageGateway } from './app.message.gateway';
import { validationSchema } from '../settings/config.validation';

@Module({
  imports: [
    PrismaModule,
    OverlayModule,
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
  ],
  controllers: [AppController],
  providers: [OverlayService, AppGateway, AppScreenGateway, AppMessageGateway],
})
export class AppModule {}
