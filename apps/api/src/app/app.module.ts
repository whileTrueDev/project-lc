import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { FirstmallDbModule } from '@project-lc/firstmall-db';
import { PrismaModule } from '@project-lc/prisma-orm';
import {
  SellerModule,
  AuthModule,
  SocialModule,
  mailerConfig,
  GoodsModule,
} from '@project-lc/nest-modules';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { validationSchema } from '../settings/config.validation';

@Module({
  imports: [
    MailerModule.forRoot(mailerConfig),
    FirstmallDbModule,
    SellerModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    SocialModule,
    GoodsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
