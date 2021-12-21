import { Module } from '@nestjs/common';
import { PrismaModule } from '@project-lc/prisma-orm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OverlayControllerModule, LiveShoppingModule } from '@project-lc/nest-modules';
import { AppController } from './app.controller';
import { validationSchema } from '../settings/config.validation';

@Module({
  imports: [
    PrismaModule,
    OverlayControllerModule,
    LiveShoppingModule,
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
  ],
  controllers: [AppController],
  providers: [ConfigService],
})
export class AppModule {}
