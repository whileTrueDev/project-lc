import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { BroadcasterService } from './broadcaster.service';
import { BroadcasterController } from './broadcaster.controller';
@Module({
  imports: [PrismaModule],
  providers: [BroadcasterService],
  exports: [BroadcasterService],
  controllers: [BroadcasterController],
})
export class BroadcasterModule {}
