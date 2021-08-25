import { Module } from '@nestjs/common';
import { GoodsService } from './goods.service';

@Module({
  providers: [GoodsService],
  exports: [GoodsService],
})
export class GoodsModule {}
