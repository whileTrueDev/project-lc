import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OverlayControllerModule } from '@project-lc/nest-modules-overlay-controller';
import { LiveShoppingModule } from '@project-lc/nest-modules-liveshopping';
import { AppController } from './app.controller';
import { validationSchema } from '../settings/config.validation';

@Module({
  imports: [
    PrismaModule,
    OverlayControllerModule,
    LiveShoppingModule.withoutControllers(),
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
  ],
  controllers: [AppController],
  providers: [ConfigService],
})
export class AppModule {}
