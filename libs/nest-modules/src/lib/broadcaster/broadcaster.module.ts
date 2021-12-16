import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { AuthModule } from '../auth/auth.module';
import { BroadcasterService } from './broadcaster.service';
import { BroadcasterController } from './broadcaster.controller';
import { BroadcasterChannelService } from './broadcaster-channel.service';
import { BroadcasterContactsService } from './broadcaster-contacts.service';
import { BroadcasterSettlementHistoryService } from './broadcaster-settlement-history.service';

@Module({
  imports: [forwardRef(() => AuthModule), PrismaModule],
  controllers: [BroadcasterController],
  providers: [
    BroadcasterService,
    BroadcasterContactsService,
    BroadcasterChannelService,
    BroadcasterSettlementHistoryService,
  ],
  exports: [
    BroadcasterService,
    BroadcasterChannelService,
    BroadcasterSettlementHistoryService,
  ],
})
export class BroadcasterModule {}
