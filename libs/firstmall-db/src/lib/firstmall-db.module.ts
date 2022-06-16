import { Module } from '@nestjs/common';
import { GoodsModule } from '@project-lc/nest-modules-goods';
import { LiveShoppingModule } from '@project-lc/nest-modules-liveshopping';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { SellerModule } from '@project-lc/nest-modules-seller';
import { ProductPromotionModule } from '@project-lc/nest-modules-product-promotion';
import { FirstmallDbService } from './firstmall-db.service';
import { FmExportsController } from './fm-exports/fm-exports.controller';
import { FmExportsService } from './fm-exports/fm-exports.service';
import { FmGoodsController } from './fm-goods/fm-goods.controller';
import { FMGoodsService } from './fm-goods/fm-goods.service';
import { FmOrdersController } from './fm-orders/fm-orders.controller';
import { FmOrdersService } from './fm-orders/fm-orders.service';
import { FmSettlementController } from './fm-settlements/fm-settlements.controller';
import { FmSettlementService } from './fm-settlements/fm-settlements.service';

@Module({
  imports: [
    GoodsModule.withoutControllers(),
    LiveShoppingModule.withoutControllers(),
    BroadcasterModule.withoutControllers(),
    SellerModule.withoutControllers(),
    ProductPromotionModule.withoutControllers(),
  ],
  controllers: [
    FmOrdersController,
    FmGoodsController,
    FmExportsController,
    FmSettlementController,
  ],
  providers: [
    FirstmallDbService,
    FMGoodsService,
    FmOrdersService,
    FmExportsService,
    FmSettlementService,
  ],
  exports: [FirstmallDbService, FMGoodsService, FmOrdersService],
})
export class FirstmallDbModule {}
