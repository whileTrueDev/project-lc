import { Module } from '@nestjs/common';
import { S3Module } from '@project-lc/nest-modules-s3';
import { MailModule } from '@project-lc/nest-modules-mail';
import { SellerSettlementService } from './seller-settlement.service';
import { SellerShopService } from './seller-shop.service';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';

@Module({
  imports: [S3Module, MailModule],
  controllers: [SellerController],
  providers: [SellerService, SellerSettlementService, SellerShopService],
  exports: [SellerService, SellerSettlementService],
})
export class SellerModule {}
