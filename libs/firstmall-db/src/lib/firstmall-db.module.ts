import { Module } from '@nestjs/common';
import { FirstmallDbService } from './firstmall-db.service';
import { FMGoodsService } from './fm-goods/fm-goods.service';

@Module({
  controllers: [],
  providers: [FirstmallDbService, FMGoodsService],
  exports: [FirstmallDbService, FMGoodsService],
})
export class FirstmallDbModule {}
