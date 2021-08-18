import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { FirstmallDbModule } from '@project-lc/firstmall-db';
import { PrismaModule } from '@project-lc/prisma-orm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SellerModule } from './seller/seller.module';
import { mailerConfig } from '../settings/mailer.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot(mailerConfig),
    FirstmallDbModule,
    SellerModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
