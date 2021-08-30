import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
