import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma-orm.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
