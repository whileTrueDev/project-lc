import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { OverlayModule } from '@project-lc/nest-modules';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppScreenGateway } from './app.screen.gateway';
import { AppMessageGateway } from './app.message.gateway';
import { AppService } from './app.service';

@Module({
  imports: [PrismaModule, OverlayModule],
  controllers: [AppController],
  providers: [AppService, AppGateway, AppScreenGateway, AppMessageGateway],
})
export class AppModule {}
