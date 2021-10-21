import { Module } from '@nestjs/common';
import { GoodsModule } from '../goods/goods.module';
import { S3Module } from '../s3/s3.module';
import { LiveShoppingController } from './live-shopping.controller';
import { LiveShoppingService } from './live-shopping.service';
@Module({
  imports: [S3Module, GoodsModule],
  providers: [LiveShoppingService],
  controllers: [LiveShoppingController],
  exports: [LiveShoppingService],
})
export class LiveShoppingModule {}
