import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailModule } from '@project-lc/nest-modules-mail';
import { PrismaModule } from '@project-lc/prisma-orm';
import { mailerConfig } from '../settings/mailer.config';
import { AppController } from './app.controller';

@Module({
  imports: [PrismaModule, MailerModule.forRoot(mailerConfig), MailModule],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
