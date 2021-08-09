import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';

@Module({
  imports: [PrismaModule],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
