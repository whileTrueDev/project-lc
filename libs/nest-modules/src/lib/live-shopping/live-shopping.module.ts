import { Module } from '@nestjs/common';
import { GoodsService, S3Module } from '@project-lc/nest-modules';
import { LiveShoppingController } from './live-shopping.controller';
@Module({
  imports: [S3Module],
  providers: [GoodsService],
  controllers: [LiveShoppingController],
})
export class LiveShoppingModule {}
