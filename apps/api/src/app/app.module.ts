import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirstmallDbModule } from '@project-lc/firstmall-db';
import { mailerConfig } from '@project-lc/nest-core';
import { ShippingGroupModule } from '@project-lc/nest-modules-shipping-group';
import { AdminModule } from '@project-lc/nest-modules-admin';
import { AuthModule, SocialModule } from '@project-lc/nest-modules-auth';
import { CipherModule } from '@project-lc/nest-modules-cipher';
import { GoodsModule } from '@project-lc/nest-modules-goods';
import { InquiryModule } from '@project-lc/nest-modules-inquiry';
import { JwtHelperModule } from '@project-lc/nest-modules-jwt-helper';
import { LiveShoppingModule } from '@project-lc/nest-modules-liveshopping';
import { NoticeModule } from '@project-lc/nest-modules-notice';
import { NotificationModule } from '@project-lc/nest-modules-notification';
import { OrderCancelModule } from '@project-lc/nest-modules-order-cancel';
import { SellerModule } from '@project-lc/nest-modules-seller';
import { PrismaModule } from '@project-lc/prisma-orm';
import { validationSchema } from '../settings/config.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
    AdminModule,
    ShippingGroupModule,
    LiveShoppingModule,
    NoticeModule,
    OrderCancelModule,
    NotificationModule,
    InquiryModule,
    CipherModule,
    JwtHelperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
