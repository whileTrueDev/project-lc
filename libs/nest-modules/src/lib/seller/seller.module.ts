import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { SellerSettlementService } from './seller-settlement.service';
import { SellerShopService } from './seller-shop.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [SellerController],
  providers: [SellerService, SellerSettlementService, SellerShopService],
  exports: [SellerService],
})
export class SellerModule {}
