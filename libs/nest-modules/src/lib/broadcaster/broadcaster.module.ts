import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { BroadcasterService } from './broadcaster.service';
import { BroadcasterController } from './broadcaster.controller';
import { BroadcasterChannelService } from './broadcaster-channel.service';
import { BroadcasterContactsService } from './broadcaster-contacts.service';

@Module({
  imports: [PrismaModule],
  providers: [BroadcasterService, BroadcasterContactsService, BroadcasterChannelService],
  exports: [BroadcasterService, BroadcasterChannelService],
  controllers: [BroadcasterController],
})
export class BroadcasterModule {}
