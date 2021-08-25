import { Module } from '@nestjs/common';
import { GoodsModule } from '@project-lc/nest-modules';
import { FirstmallDbService } from './firstmall-db.service';
import { FMGoodsService } from './fm-goods/fm-goods.service';
import { FmOrdersService } from './fm-orders/fm-orders.service';
import { FmOrdersController } from './fm-orders/fm-orders.controller';

@Module({
  imports: [GoodsModule],
  controllers: [FmOrdersController],
  providers: [FirstmallDbService, FMGoodsService, FmOrdersService],
  exports: [FirstmallDbService, FMGoodsService, FmOrdersService],
})
export class FirstmallDbModule {}
