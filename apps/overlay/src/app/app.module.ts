import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { OverlayService, OverlayModule } from '@project-lc/nest-modules';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppScreenGateway } from './app.screen.gateway';
import { AppMessageGateway } from './app.message.gateway';

@Module({
  imports: [PrismaModule, OverlayModule],
  controllers: [AppController],
  providers: [OverlayService, AppGateway, AppScreenGateway, AppMessageGateway],
})
export class AppModule {}
