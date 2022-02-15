import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { MailModule } from '../lib/mail/mail.module';
import { AppService } from './app.service';
import { S3Module } from '../lib/s3/s3.module';
@Module({
  imports: [PrismaModule, MailModule, S3Module],
  providers: [AppService],
})
export class AppModule {}
