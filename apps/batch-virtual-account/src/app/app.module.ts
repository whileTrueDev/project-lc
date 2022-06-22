import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';

import { AppService } from './app.service';
import VirtualAccountService from './virtual-account.service';

@Module({
  imports: [PrismaModule],
  providers: [AppService, VirtualAccountService],
})
export class AppModule {}
