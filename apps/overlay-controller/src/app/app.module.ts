import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { OverlayControllerService } from '@project-lc/nest-modules';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [AppService, OverlayControllerService],
})
export class AppModule {}
