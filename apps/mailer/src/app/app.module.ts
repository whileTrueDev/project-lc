import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { MailModule } from '../lib/mail/mail.module';
import { AppController } from './app.controller';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [AppController],
})
export class AppModule {}
