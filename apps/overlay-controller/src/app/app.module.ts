import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { OverlayControllerService } from '@project-lc/nest-modules';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [OverlayControllerService, ConfigService],
})
export class AppModule {}
