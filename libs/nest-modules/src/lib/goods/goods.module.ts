import { Module } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { GoodsInfoService } from '../goods-info/goods-info.service';

@Module({
  providers: [GoodsService, GoodsInfoService],
  exports: [GoodsService, GoodsInfoService],
  controllers: [GoodsController],
})
export class GoodsModule {}
