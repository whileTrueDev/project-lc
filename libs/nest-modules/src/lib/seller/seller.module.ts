import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { SellerSettlementService } from './seller-settlement.service';
import { SellerShopService } from './seller-shop.service';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [forwardRef(() => AuthModule), S3Module],
  controllers: [SellerController],
  providers: [SellerService, SellerSettlementService, SellerShopService],
  exports: [SellerService, SellerSettlementService],
})
export class SellerModule {}
