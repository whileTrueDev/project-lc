import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { SellerSettlementService } from './seller-settlement.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [SellerController],
  providers: [SellerService, SellerSettlementService],
  exports: [SellerService],
})
export class SellerModule {}
