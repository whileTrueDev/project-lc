import { Module } from '@nestjs/common';
import { ShippingGroupController } from './shipping-group.controller';
import { ShippingGroupService } from './shipping-group.service';

@Module({
  controllers: [ShippingGroupController],
  providers: [ShippingGroupService],
})
export class ShippingGroupModule {}
