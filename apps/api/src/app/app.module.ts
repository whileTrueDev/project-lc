import { Module } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { FirstmallDbModule } from '@project-lc/firstmall-db';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [FirstmallDbModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
