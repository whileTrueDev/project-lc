import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheConfig } from '@project-lc/nest-core';
import { JwtHelperModule } from '@project-lc/nest-modules-jwt-helper';
import { LiveShoppingStateRealtimeModule } from '@project-lc/nest-modules-liveshopping';
import { NotificationRealtimeModule } from '@project-lc/nest-modules-notification';
import { validationSchema } from '../settings/config.validation';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    CacheModule.registerAsync({ isGlobal: true, useClass: CacheConfig }),
    NotificationRealtimeModule,
    LiveShoppingStateRealtimeModule,
    JwtHelperModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
