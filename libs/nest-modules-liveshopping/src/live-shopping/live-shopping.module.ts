import { Module } from '@nestjs/common';
import { S3Module } from '@project-lc/nest-modules-s3';
import { GoodsModule } from '@project-lc/nest-modules-goods';
import { LiveShoppingController } from './live-shopping.controller';
import { LiveShoppingService } from './live-shopping.service';
import { PurchaseMessageService } from './purchase-message.service';
import { LiveShoppingStateBoardMessageService } from './live-shopping-state-board-message.service';
@Module({
  imports: [S3Module, GoodsModule],
  providers: [
    LiveShoppingService,
    PurchaseMessageService,
    LiveShoppingStateBoardMessageService,
  ],
  controllers: [LiveShoppingController],
  exports: [
    LiveShoppingService,
    PurchaseMessageService,
    LiveShoppingStateBoardMessageService,
  ],
})
export class LiveShoppingModule {}
