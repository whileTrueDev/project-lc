import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mailerConfig } from '@project-lc/nest-core';
import { AuthModule } from '@project-lc/nest-modules-auth';
import { CipherModule } from '@project-lc/nest-modules-cipher';
import { JwtHelperModule } from '@project-lc/nest-modules-jwt-helper';
import { NotificationRealtimeModule } from '@project-lc/nest-modules-notification';
import { PrismaModule } from '@project-lc/prisma-orm';
import { validationSchema } from '../settings/config.validation';
import { AppController } from './app.controller';

@Module({
  imports: [
    AuthModule,
    MailerModule.forRoot(mailerConfig),
    NotificationRealtimeModule,
    PrismaModule,
    JwtHelperModule,
    CipherModule,
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
  ],
  controllers: [AppController],
})
export class AppModule {}
