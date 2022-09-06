import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheConfig } from '@project-lc/nest-core';
import { LiveShoppingModule } from '@project-lc/nest-modules-liveshopping';
import {
  OverlayControllerModule,
  OverlayThemeModule,
} from '@project-lc/nest-modules-overlay-controller';
import { PrismaModule } from '@project-lc/prisma-orm';
import { AuthModule } from '@project-lc/nest-modules-auth';
import { validationSchema } from '../settings/config.validation';
import { AppController } from './app.controller';
import { AuthController } from './auth.contoller';

@Module({
  imports: [
    AuthModule,
    CacheModule.registerAsync({ isGlobal: true, useClass: CacheConfig }),
    PrismaModule,
    OverlayControllerModule,
    LiveShoppingModule.withoutControllers(),
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    OverlayThemeModule.withoutControllers(),
  ],
  controllers: [AppController, AuthController],
  providers: [ConfigService],
})
export class AppModule {}
