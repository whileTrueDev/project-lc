import { Module } from '@nestjs/common';
import { LiveShoppingStateGateway } from './live-shopping-state.gateway';

@Module({
  providers: [LiveShoppingStateGateway],
  controllers: [],
  exports: [],
})
export class LiveShoppingStateRealtimeModule {}
