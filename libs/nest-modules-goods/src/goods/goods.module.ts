import { Module } from '@nestjs/common';
import { S3Module } from '@project-lc/nest-modules-s3';
import { GoodsInfoService } from './goods-info.service';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';

@Module({
  imports: [S3Module],
  providers: [GoodsService, GoodsInfoService],
  exports: [GoodsService, GoodsInfoService],
  controllers: [GoodsController],
})
export class GoodsModule {}
