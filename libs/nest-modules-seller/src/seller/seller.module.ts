import { Module } from '@nestjs/common';
import { MailModule } from '@project-lc/nest-modules-mail';
import { S3Module } from '@project-lc/nest-modules-s3';
import { SellerContactsController } from './seller-contacts.controller';
import { SellerContactsService } from './seller-contacts.service';
import { SellerSettlementService } from './seller-settlement.service';
import { SellerShopService } from './seller-shop.service';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';

@Module({
  imports: [S3Module, MailModule],
  controllers: [SellerController, SellerContactsController],
  providers: [
    SellerService,
    SellerSettlementService,
    SellerShopService,
    SellerContactsService,
  ],
  exports: [SellerService, SellerSettlementService],
})
export class SellerModule {}
