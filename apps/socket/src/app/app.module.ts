import { Module } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, AppGateway],
})
export class AppModule {}
