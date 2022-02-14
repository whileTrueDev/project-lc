import { Module } from '@nestjs/common';
import { ProductPromotionService } from './product-promotion.service';

@Module({
  controllers: [],
  providers: [ProductPromotionService],
  exports: [ProductPromotionService],
})
export class ProductPromotionModule {}
