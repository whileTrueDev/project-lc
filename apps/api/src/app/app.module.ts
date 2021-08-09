import { Module } from '@nestjs/common';
import { FirstmallDbModule } from '@project-lc/firstmall-db';
import { PrismaModule } from '@project-lc/prisma-orm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SellerModule } from './seller/seller.module';

@Module({
  imports: [FirstmallDbModule, SellerModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
