import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheConfig } from '@project-lc/nest-core';
import { LiveShoppingModule } from '@project-lc/nest-modules-liveshopping';
import { OverlayControllerModule } from '@project-lc/nest-modules-overlay-controller';
import { PrismaModule } from '@project-lc/prisma-orm';
import { validationSchema } from '../settings/config.validation';
import { AppController } from './app.controller';

@Module({
  imports: [
    CacheModule.registerAsync({ isGlobal: true, useClass: CacheConfig }),
    PrismaModule,
    OverlayControllerModule,
    LiveShoppingModule.withoutControllers(),
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
  ],
  controllers: [AppController],
  providers: [ConfigService],
})
export class AppModule {}
