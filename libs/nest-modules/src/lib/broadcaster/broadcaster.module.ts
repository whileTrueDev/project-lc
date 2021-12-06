import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { BroadcasterService } from './broadcaster.service';
import { BroadcasterController } from './broadcaster.controller';
import { BroadcasterContactsService } from './broadcaster-contacts.service';
@Module({
  imports: [PrismaModule],
  providers: [BroadcasterService, BroadcasterContactsService],
  exports: [BroadcasterService],
  controllers: [BroadcasterController],
})
export class BroadcasterModule {}
