import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { BroadcasterService } from './broadcaster.service';
@Module({
  imports: [PrismaModule],
  providers: [BroadcasterService],
})
export class BroadcasterModule {}
