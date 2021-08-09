import { Module } from '@nestjs/common';
import { FirstmallDbModule } from '@project-lc/firstmall-db';
import { PrismaService } from '@project-lc/prisma-orm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SellerModule } from './seller/seller.module';

@Module({
  imports: [FirstmallDbModule, SellerModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
