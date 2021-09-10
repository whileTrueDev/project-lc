import { Module } from '@nestjs/common';
import { GoodsModule } from '@project-lc/nest-modules';
import { FirstmallDbService } from './firstmall-db.service';
import { FmExportsController } from './fm-exports/fm-exports.controller';
import { FmExportsService } from './fm-exports/fm-exports.service';
import { FMGoodsService } from './fm-goods/fm-goods.service';
import { FmOrdersController } from './fm-orders/fm-orders.controller';
import { FmOrdersService } from './fm-orders/fm-orders.service';

@Module({
  imports: [GoodsModule],
  controllers: [FmOrdersController, FmExportsController],
  providers: [FirstmallDbService, FMGoodsService, FmOrdersService, FmExportsService],
  exports: [FirstmallDbService, FMGoodsService, FmOrdersService],
})
export class FirstmallDbModule {}
