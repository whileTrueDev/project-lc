import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { AuthModule } from '../auth/auth.module';
import { BroadcasterChannelService } from './broadcaster-channel.service';
import { BroadcasterContactsService } from './broadcaster-contacts.service';
import { BroadcasterSettlementHistoryService } from './broadcaster-settlement-history.service';
import { BroadcasterSettlementService } from './broadcaster-settlement.service';
import { BroadcasterController } from './broadcaster.controller';
import { BroadcasterService } from './broadcaster.service';

@Module({
  imports: [forwardRef(() => AuthModule), PrismaModule],
  controllers: [BroadcasterController],
  providers: [
    BroadcasterService,
    BroadcasterContactsService,
    BroadcasterChannelService,
    BroadcasterSettlementHistoryService,
    BroadcasterSettlementService,
  ],
  exports: [
    BroadcasterService,
    BroadcasterChannelService,
    BroadcasterSettlementHistoryService,
    BroadcasterSettlementService,
    BroadcasterSettlementHistoryService,
  ],
})
export class BroadcasterModule {}
