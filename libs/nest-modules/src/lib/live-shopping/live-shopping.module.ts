import { Module } from '@nestjs/common';
import { GoodsModule } from '../goods/goods.module';
import { S3Module } from '../s3/s3.module';
import { LiveShoppingController } from './live-shopping.controller';
@Module({
  imports: [S3Module, GoodsModule],
  controllers: [LiveShoppingController],
})
export class LiveShoppingModule {}
