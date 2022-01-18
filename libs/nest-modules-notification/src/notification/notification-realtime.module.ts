import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Module({
  providers: [NotificationGateway],
  controllers: [],
  exports: [],
})
export class NotificationRealtimeModule {}
