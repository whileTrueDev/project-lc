import { MailerModule } from '@nestjs-modules/mailer';
import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { CacheConfig, CsrfTokenMiddleware, mailerConfig } from '@project-lc/nest-core';
import { AdminModule } from '@project-lc/nest-modules-admin';
import { AuthModule, SocialModule } from '@project-lc/nest-modules-auth';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { CartModule } from '@project-lc/nest-modules-cart';
import { CipherModule } from '@project-lc/nest-modules-cipher';
import { CouponModule } from '@project-lc/nest-modules-coupon';
import { CustomerModule } from '@project-lc/nest-modules-customer';
import { DeliveryModule } from '@project-lc/nest-modules-delivery';
import { ExchangeModule } from '@project-lc/nest-modules-exchange';
import { ExportModule } from '@project-lc/nest-modules-export';
import { GoodsModule } from '@project-lc/nest-modules-goods';
import { GoodsCategoryModule } from '@project-lc/nest-modules-goods-category';
import { GoodsInformationSubjectModule } from '@project-lc/nest-modules-goods-information-subject';
import { GoodsInquiryModule } from '@project-lc/nest-modules-goods-inquiry';
import { GoodsReviewModule } from '@project-lc/nest-modules-goods-review';
import { InquiryModule } from '@project-lc/nest-modules-inquiry';
import { JwtHelperModule } from '@project-lc/nest-modules-jwt-helper';
import {
  KkshowBcListModule,
  KkshowMainModule,
  KkshowShoppingModule,
  KkshowSubNavModule,
} from '@project-lc/nest-modules-kkshow-main';
import { KkshowSearchModule } from '@project-lc/nest-modules-kkshow-search';
import { LiveShoppingModule } from '@project-lc/nest-modules-liveshopping';
import { ManualModule } from '@project-lc/nest-modules-manual';
import { MileageModule } from '@project-lc/nest-modules-mileage';
import { NoticeModule } from '@project-lc/nest-modules-notice';
import { NotificationModule } from '@project-lc/nest-modules-notification';
import { OrderModule } from '@project-lc/nest-modules-order';
import { OrderCancelModule } from '@project-lc/nest-modules-order-cancel';
import { PaymentModule } from '@project-lc/nest-modules-payment';
import { PolicyModule } from '@project-lc/nest-modules-policy';
import { ProductPromotionModule } from '@project-lc/nest-modules-product-promotion';
import { RefundModule } from '@project-lc/nest-modules-refund';
import { ReturnModule } from '@project-lc/nest-modules-return';
import { SellerModule } from '@project-lc/nest-modules-seller';
import { ShippingGroupModule } from '@project-lc/nest-modules-shipping-group';
import { PrismaModule } from '@project-lc/prisma-orm';
import { validationSchema } from '../settings/config.validation';
import { AppController } from './app.controller';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    CacheModule.registerAsync({ isGlobal: true, useClass: CacheConfig }),
    MailerModule.forRoot(mailerConfig),
    AuthModule,
    PrismaModule,
    SocialModule,
    ShippingGroupModule,
    NoticeModule,
    NotificationModule,
    InquiryModule,
    CipherModule,
    JwtHelperModule,
    OrderCancelModule.withControllers(),
    AdminModule.withControllers(),
    SellerModule.withControllers(),
    GoodsModule.withControllers(),
    LiveShoppingModule.withControllers(),
    BroadcasterModule.withControllers(),
    PolicyModule.withControllers(),
    KkshowMainModule.withControllers(),
    ManualModule.withControllers(),
    KkshowSearchModule.withControllers(),
    KkshowShoppingModule.withControllers(),
    KkshowSubNavModule.withControllers(),
    KkshowBcListModule.withControllers(),
    CustomerModule.withControllers(),
    PaymentModule.withControllers(),
    OrderModule.withControllers(),
    CartModule.withControllers(),
    OrderModule.withControllers(),
    ReturnModule.withControllers(),
    GoodsInquiryModule.withControllers(),
    GoodsReviewModule.withControllers(),
    GoodsCategoryModule.withControllers(),
    GoodsInformationSubjectModule.withControllers(),
    MileageModule.withControllers(),
    CouponModule.withControllers(),
    RefundModule.withControllers(),
    ExchangeModule.withControllers(),
    ExportModule.withControllers(),
    ProductPromotionModule.withControllers(),
    DeliveryModule.withControllers(),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(CsrfTokenMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
