import { Module } from '@nestjs/common';
import { S3Module } from '@project-lc/nest-modules-s3';
import { GoodsModule } from '@project-lc/nest-modules-goods';
import { LiveShoppingController } from './live-shopping.controller';
import { LiveShoppingService } from './live-shopping.service';
import { PurchaseMessageService } from './purchase-message.service';
import { LiveShoppingStateBoardService } from './live-shopping-state-board.service';
@Module({
  imports: [S3Module, GoodsModule],
  providers: [LiveShoppingService, PurchaseMessageService, LiveShoppingStateBoardService],
  controllers: [LiveShoppingController],
  exports: [LiveShoppingService, PurchaseMessageService, LiveShoppingStateBoardService],
})
export class LiveShoppingModule {}
