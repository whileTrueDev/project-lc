import { Module } from '@nestjs/common';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { ProductPromotionService } from './product-promotion.service';

@Module({
  imports: [BroadcasterModule.withoutControllers()],
  controllers: [],
  providers: [ProductPromotionService],
  exports: [ProductPromotionService],
})
export class ProductPromotionModule {}
