import { Module } from '@nestjs/common';
import { OrderCancelService } from './order-cancel.service';
import { OrderCancelController } from './order-cancel.controller';

@Module({
  providers: [OrderCancelService],
  controllers: [OrderCancelController],
  exports: [OrderCancelService],
})
export class OrderCancelModule {}
