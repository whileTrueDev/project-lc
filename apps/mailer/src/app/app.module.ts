import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mailerConfig } from '../settings/mailer.config';

@Module({
  imports: [PrismaModule, MailerModule.forRoot(mailerConfig)],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
